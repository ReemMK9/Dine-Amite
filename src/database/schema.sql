-- Dine'Amite Database Schema
-- SQL schema

-- Drop tables in reverse dependency order (if they exist)
DROP TABLE IF EXISTS recipe_saved_items;
DROP TABLE IF EXISTS recipe_saved;
DROP TABLE IF EXISTS grocery_list_items;
DROP TABLE IF EXISTS grocery_list;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS recipe_dietary_tags;
DROP TABLE IF EXISTS recipe_nutrition;
DROP TABLE IF EXISTS recipe_category;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS recipe_ingredient;
DROP TABLE IF EXISTS ingredient;
DROP TABLE IF EXISTS recipe;
DROP TABLE IF EXISTS dietary_preference;
DROP TABLE IF EXISTS app_user;

-- USER MANAGEMENT TABLES

CREATE TABLE app_user (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    img VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE dietary_preference (
    user_id UUID,
    dietary_preference VARCHAR(50),
    PRIMARY KEY (user_id, dietary_preference),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- RECIPE TABLES

CREATE TABLE recipe (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    summary TEXT,
    instructions TEXT,
    steps JSONB,
    preparation_time INT,
    cooking_time INT,
    ready_in INT,
    servings INT,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredient (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    name_alt VARCHAR(100) NOT NULL,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredient (
    recipe_id INT,
    ingredient_id INT,
    amount FLOAT,
    unit VARCHAR(20),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE recipe_category (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

CREATE TABLE recipe_dietary_tags (
    recipe_id INT,
    dietary_tag VARCHAR(50),
    PRIMARY KEY (recipe_id, dietary_tag),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);

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

-- USER INTERACTION TABLES

CREATE TABLE grocery_list (
    list_id SERIAL PRIMARY KEY,
    user_id UUID,
    list_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE TABLE grocery_list_items (
    list_id INT,
    ingredient_id INT,
    amount FLOAT,
    checked BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (list_id, ingredient_id),
    FOREIGN KEY (list_id) REFERENCES grocery_list(list_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE recipe_saved (
    recipe_saved_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'Untitled List',
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE TABLE recipe_saved_items (
    recipe_saved_id INT,
    recipe_id INT,
    PRIMARY KEY (recipe_saved_id, recipe_id),
    FOREIGN KEY (recipe_saved_id) REFERENCES recipe_saved(recipe_saved_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    recipe_id INT,
    user_id UUID,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);