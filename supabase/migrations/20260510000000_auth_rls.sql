--- Authentication Migration 
--- PostgreSQL RLS reference: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

-- Create user roles table to support admin users
-- Adapted from https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac
CREATE TYPE public.user_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  PRIMARY KEY (user_id, role)
);
GRANT all ON public.user_roles TO authenticated;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
--- Allow users to see their own roles
CREATE POLICY "Users can see their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
);

--- Explicit grants since Supabase data API changes will require them
GRANT select ON public.datasets TO anon;
GRANT select ON public.dataset_items TO anon;
GRANT all ON public.datasets TO authenticated;
GRANT all ON public.dataset_items TO authenticated;

--- Track owner of datasets
ALTER TABLE public.datasets ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
--- Allow anyone to read datasets
CREATE POLICY "Datasets are visible to everyone"
ON public.datasets FOR SELECT
TO anon, authenticated
USING (true);
--- Only owners can modify their datasets
CREATE POLICY "Owners can manage their datasets"
ON public.datasets FOR all
TO authenticated
USING (
  owner_id = (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE public.user_roles.user_id = (SELECT auth.uid()) AND public.user_roles.role = 'admin'
  )
);

--- Restrict modification of dataset items to owners of the parent dataset
ALTER TABLE public.dataset_items ENABLE ROW LEVEL SECURITY;
--- Allow anyone to read dataset items
CREATE POLICY "Dataset items are visible to everyone"
ON public.dataset_items FOR SELECT
TO anon, authenticated
USING (true);
--- Only owners of the parent dataset can modify items
CREATE POLICY "Owners can manage dataset items & admins can manage all items"
ON public.dataset_items FOR all
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.datasets
    WHERE 
      public.datasets.id = public.dataset_items.dataset_id AND (
        public.datasets.owner_id = (SELECT auth.uid()) OR
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE public.user_roles.user_id = (SELECT auth.uid()) AND public.user_roles.role = 'admin'
        )
      )
  )
);
