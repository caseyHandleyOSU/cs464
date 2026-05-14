--- Authentication Migration 
--- PostgreSQL RLS reference: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

--- Track owner of datasets
ALTER TABLE public.datasets ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
--- Allow anyone to read datasets
CREATE POLICY "Datasets are visible to everyone"
ON public.datasets FOR SELECT
USING (true);
--- Only owners can modify their datasets
CREATE POLICY "Owners can manage their datasets"
ON public.datasets
USING ((SELECT auth.uid()) = owner_id);

--- Restrict modification of dataset items to owners of the parent dataset
ALTER TABLE public.dataset_items ENABLE ROW LEVEL SECURITY;
--- Allow anyone to read dataset items
CREATE POLICY "Dataset items are visible to everyone"
ON public.dataset_items FOR SELECT
USING (true);
--- Only owners of the parent dataset can modify items
CREATE POLICY "Owners can manage dataset items"
ON public.dataset_items
USING (EXISTS (SELECT 1 FROM public.datasets WHERE public.datasets.id = public.dataset_items.dataset_id AND public.datasets.owner_id = auth.uid()));

-- Create user roles table to support admin users
-- Adapted from https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac
CREATE TYPE public.user_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  PRIMARY KEY (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
--- Allow users to see their own roles
CREATE POLICY "Users can see their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

--- Grant admins acces to edit all datasets and items
CREATE POLICY "Admins can edit all datasets"
ON public.datasets
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE public.user_roles.user_id = auth.uid() AND public.user_roles.role = 'admin'));
CREATE POLICY "Admins can edit all dataset items"
ON public.dataset_items
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE public.user_roles.user_id = auth.uid() AND public.user_roles.role = 'admin'));