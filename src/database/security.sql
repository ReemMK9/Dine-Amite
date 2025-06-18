-- Enable Row Level Security for tables
ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredient ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE review ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_saved ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_saved_items ENABLE ROW LEVEL SECURITY;

-- -- Allow users to SELECT only their own data
-- CREATE POLICY "Allow user to view their profile" ON app_user
-- FOR SELECT USING (auth.uid() = user_id);

-- -- Allow users to INSERT only their own data
-- CREATE POLICY "Allow user to add their own profile" ON app_user
-- FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -- Restrict recipe access (only allow users to see their saved recipes)
-- CREATE POLICY "Allow user to view saved recipes" ON recipe_saved
-- FOR SELECT USING (auth.uid() = user_id);