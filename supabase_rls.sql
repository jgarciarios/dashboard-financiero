-- Script de Configuración Seguridad Multi-usuario (Row Level Security)
-- Este script blinda todas las tablas para que actúen de forma privada para cada usuario logueado.
-- Ejecutar en el SQL Editor del panel web de Supabase.

-- 1. ASEGURAR COLUMNAS DE RELACIÓN
-- Agregamos la columna user_id en caso de que alguna tabla no la tenga formalmente ligada a Auth
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 3. ELIMINAR POLÍTICAS ANTERIORES SI EXISTIERAN (Limpieza por seguridad)
DROP POLICY IF EXISTS "Public accounts access" ON accounts;
DROP POLICY IF EXISTS "Public investments access" ON investments;
DROP POLICY IF EXISTS "Public transactions access" ON transactions;
DROP POLICY IF EXISTS "Public budgets access" ON budgets;
DROP POLICY IF EXISTS "Users can manage their own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can manage their own investments" ON investments;
DROP POLICY IF EXISTS "Users can manage their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can manage their own budgets" ON budgets;

-- 4. CREAR POLÍTICAS UNIFICADAS STRICT-AUTH (Aislamiento Total)
-- Accounts
CREATE POLICY "Users can manage their own accounts" 
ON accounts FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Investments
CREATE POLICY "Users can manage their own investments" 
ON investments FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can manage their own transactions" 
ON transactions FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Budgets
CREATE POLICY "Users can manage their own budgets" 
ON budgets FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Opcional: Asegurarse de que al crear un nuevo registro a mano no se rompa el Not Null en un futuro próximo
-- Si se quiere forzar la obligatoriedad (Recomendado después de que todos los datos tengan user_id)
-- ALTER TABLE accounts ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;
