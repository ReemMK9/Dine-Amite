-- Create Category Table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Junction Table
CREATE TABLE recipe_category (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

-- Create Nutrition Table
CREATE TABLE recipe_nutrition (
    recipe_id INT PRIMARY KEY REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    calories FLOAT DEFAULT 0,
    fat FLOAT DEFAULT 0,
    saturated_fat FLOAT DEFAULT 0,
    carbohydrates FLOAT DEFAULT 0,
    net_carbohydrates FLOAT DEFAULT 0,
    fiber FLOAT DEFAULT 0,
    sugar FLOAT DEFAULT 0,
    cholesterol FLOAT DEFAULT 0,
    sodium FLOAT DEFAULT 0,
    protein FLOAT DEFAULT 0,
    glycemic_index FLOAT DEFAULT 0,
    glycemic_load FLOAT DEFAULT 0,
    nutrition_score FLOAT DEFAULT 0,
    percent_protein FLOAT DEFAULT 0,
    percent_fat FLOAT DEFAULT 0,
    percent_carbs FLOAT DEFAULT 0,
    weight_per_serving FLOAT DEFAULT 0,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);