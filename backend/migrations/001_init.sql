BEGIN;

CREATE TABLE IF NOT EXISTS vouchers (
    id BIGSERIAL PRIMARY KEY,
    voucher_code TEXT NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
    expiry_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_vouchers_voucher_code ON vouchers (voucher_code);
CREATE INDEX IF NOT EXISTS idx_vouchers_expiry_date ON vouchers (expiry_date);
CREATE INDEX IF NOT EXISTS idx_vouchers_discount_percent ON vouchers (discount_percent);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vouchers_set_updated_at ON vouchers;
CREATE TRIGGER trg_vouchers_set_updated_at
BEFORE UPDATE ON vouchers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
