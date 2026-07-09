-- =========================================================================
-- Religious Tours — Accounting engine (Section 7 of the master brief)
-- Full double-entry, accrual basis.
-- =========================================================================

-- ---------------------------------------------------------------------
-- chart_of_accounts
-- ---------------------------------------------------------------------
create table chart_of_accounts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  type text not null check (type in ('asset','liability','equity','revenue','expense')),
  subtype text check (subtype in (
    'cash','ar','prepaid','fixed_asset','contra_asset',
    'ap','unearned_revenue','accrued_liability','tax_payable',
    'capital','drawings','retained_earnings',
    'operating_revenue','other_income','cogs','opex'
  )),
  normal_balance text not null check (normal_balance in ('debit','credit')),
  parent_id uuid references chart_of_accounts(id),
  vertical text,
  is_active boolean default true,
  is_system boolean default false,
  created_at timestamptz default now()
);
create index idx_coa_type on chart_of_accounts(type);
create index idx_coa_code on chart_of_accounts(code);

-- ---------------------------------------------------------------------
-- vendors
-- ---------------------------------------------------------------------
create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text check (category in ('hotel','airline','ground_transport','visa_processor','other')),
  default_payable_account_id uuid references chart_of_accounts(id),
  contact_info jsonb,
  created_at timestamptz default now()
);

alter table agents add constraint fk_agents_payable_account
  foreign key (payable_account_id) references chart_of_accounts(id);

-- ---------------------------------------------------------------------
-- accounting_periods
-- ---------------------------------------------------------------------
create table accounting_periods (
  id uuid primary key default gen_random_uuid(),
  period_type text check (period_type in ('month','quarter','year')),
  start_date date not null,
  end_date date not null,
  status text check (status in ('open','closed')) default 'open',
  closed_by uuid references profiles(id),
  closed_at timestamptz
);

-- ---------------------------------------------------------------------
-- journal_entries / journal_lines
-- ---------------------------------------------------------------------
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  reference text,
  memo text,
  tour_event_id uuid references tour_events(id),
  source text not null default 'manual' check (source in ('manual','booking_auto','payment_verification','vendor_bill','vendor_payment','trip_completion','closing_entry','reversal')),
  reversed_entry_id uuid references journal_entries(id),
  created_by uuid references profiles(id),
  posted boolean default true,
  period_id uuid references accounting_periods(id),
  created_at timestamptz default now()
);
create index idx_je_date on journal_entries(entry_date);
create index idx_je_tour_event on journal_entries(tour_event_id);

create table journal_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid references journal_entries(id) on delete cascade,
  account_id uuid references chart_of_accounts(id),
  vendor_id uuid references vendors(id),
  customer_id uuid references profiles(id),
  debit bigint not null default 0,
  credit bigint not null default 0,
  memo text,
  constraint chk_single_sided check (not (debit > 0 and credit > 0)),
  constraint chk_non_negative check (debit >= 0 and credit >= 0)
);
create index idx_jl_entry on journal_lines(journal_entry_id);
create index idx_jl_account on journal_lines(account_id);
create index idx_jl_vendor on journal_lines(vendor_id);
create index idx_jl_customer on journal_lines(customer_id);

-- Hard invariant: sum(debit) = sum(credit) per journal_entry_id, always.
create or replace function fn_check_journal_balance() returns trigger as $$
declare
  v_entry_id uuid;
  v_debit_total bigint;
  v_credit_total bigint;
begin
  v_entry_id := coalesce(new.journal_entry_id, old.journal_entry_id);
  select coalesce(sum(debit),0), coalesce(sum(credit),0)
    into v_debit_total, v_credit_total
    from journal_lines where journal_entry_id = v_entry_id;
  if v_debit_total <> v_credit_total then
    raise exception 'Unbalanced journal entry %: debits % != credits %', v_entry_id, v_debit_total, v_credit_total;
  end if;
  return new;
end;
$$ language plpgsql;

create constraint trigger trg_check_journal_balance
after insert or update or delete on journal_lines
deferrable initially deferred
for each row execute function fn_check_journal_balance();

-- ---------------------------------------------------------------------
-- fixed_assets
-- ---------------------------------------------------------------------
create table fixed_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  purchase_date date not null,
  cost bigint not null,
  useful_life_months int not null,
  salvage_value bigint default 0,
  asset_account_id uuid references chart_of_accounts(id),
  accum_depreciation_account_id uuid references chart_of_accounts(id),
  disposed boolean default false,
  disposed_date date,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- financial_notes
-- ---------------------------------------------------------------------
create table financial_notes (
  id uuid primary key default gen_random_uuid(),
  period_id uuid references accounting_periods(id),
  note_number int not null,
  title text not null,
  auto_content jsonb,
  admin_commentary text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Seed: Chart of Accounts (Section 7.1 numbering blocks)
-- ---------------------------------------------------------------------
insert into chart_of_accounts (code, name, type, subtype, normal_balance, vertical, is_system) values
-- Assets
('10100','Cash on Hand','asset','cash','debit',null,true),
('10200','Bank Account — PKR','asset','cash','debit',null,true),
('10250','Bank Account — USD','asset','cash','debit',null,false),
('11000','Accounts Receivable','asset','ar','debit',null,true),
('11500','Payment Proofs Pending Verification','asset','ar','debit',null,true),
('12000','Prepaid Vendor Deposits — Hotels','asset','prepaid','debit',null,false),
('12100','Prepaid Vendor Deposits — Airlines','asset','prepaid','debit',null,false),
('13000','Fixed Assets — Office Equipment','asset','fixed_asset','debit',null,false),
('13900','Accumulated Depreciation','asset','contra_asset','credit',null,false),
-- Liabilities
('20100','Accounts Payable — Vendors','liability','ap','credit',null,true),
('20200','Accounts Payable — Ground Transport','liability','ap','credit',null,false),
('21000','Unearned Revenue / Customer Deposits','liability','unearned_revenue','credit',null,true),
('21100','Unearned Revenue — Iraq Ziarat','liability','unearned_revenue','credit','iraq_ziarat',true),
('21200','Unearned Revenue — Iran Ziarat','liability','unearned_revenue','credit','iran_ziarat',true),
('21300','Unearned Revenue — Umrah','liability','unearned_revenue','credit','umrah',true),
('21400','Unearned Revenue — Sunni Group Tours','liability','unearned_revenue','credit','sunni_group',true),
('22000','Salaries Payable','liability','accrued_liability','credit',null,false),
('23000','Sales Tax / Withholding Tax Payable','liability','tax_payable','credit',null,false),
('24000','Commission Payable','liability','accrued_liability','credit',null,false),
-- Equity
('30100','Owner''s Capital','equity','capital','credit',null,true),
('30200','Owner''s Drawings','equity','drawings','debit',null,true),
('30900','Retained Earnings','equity','retained_earnings','credit',null,true),
-- Revenue
('41000','Revenue — Iraq Ziarat','revenue','operating_revenue','credit','iraq_ziarat',true),
('42000','Revenue — Iran Ziarat','revenue','operating_revenue','credit','iran_ziarat',true),
('43000','Revenue — Umrah','revenue','operating_revenue','credit','umrah',true),
('44000','Revenue — Air Tickets','revenue','operating_revenue','credit','air_ticket',true),
('45000','Revenue — Visa Services','revenue','operating_revenue','credit','visa',true),
('46000','Revenue — Sunni Group Tours','revenue','operating_revenue','credit','sunni_group',true),
('49000','Other Income','revenue','other_income','credit',null,false),
-- COGS
('51000','Hotel Costs','expense','cogs','debit',null,false),
('52000','Airfare Costs','expense','cogs','debit',null,false),
('53000','Visa Processing Fees','expense','cogs','debit',null,false),
('54000','Ground Transport & Guide Fees','expense','cogs','debit',null,false),
('55000','Meals','expense','cogs','debit',null,false),
('56000','Group Coordinator Costs','expense','cogs','debit',null,false),
('57000','Commission Expense','expense','cogs','debit',null,false),
-- OPEX
('61000','Salaries & Wages','expense','opex','debit',null,false),
('62000','Marketing & Ads','expense','opex','debit',null,false),
('63000','Software & Subscriptions','expense','opex','debit',null,false),
('64000','Office Rent & Utilities','expense','opex','debit',null,false),
('65000','Bank Charges','expense','opex','debit',null,false),
('66000','Depreciation Expense','expense','opex','debit',null,false),
('69000','Miscellaneous Expense','expense','opex','debit',null,false);
