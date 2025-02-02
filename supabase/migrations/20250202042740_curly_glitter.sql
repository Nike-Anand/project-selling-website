/*
  # Initial Schema Setup for ProjectHub

  1. New Tables
    - `projects`
      - Core project information including title, description, price
      - Includes metadata like difficulty level, category, rating
    - `project_technologies`
      - Junction table for project-technology relationships
    - `technologies`
      - List of available technologies
    - `categories`
      - Project categories
    - `cart_items`
      - Tracks items in user carts
    - `wishlists`
      - Tracks user wishlist items
    - `purchases`
      - Records of completed purchases
    - `reviews`
      - User reviews and ratings for projects

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Public read access to projects, technologies, categories
      - Authenticated user access to cart and wishlist
      - Owner-only access to reviews
*/

-- Create tables with proper relationships and constraints
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  preview_image text NOT NULL,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  category_id uuid REFERENCES categories(id) NOT NULL,
  rating decimal(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE project_technologies (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

CREATE TABLE wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Categories: Anyone can read
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Technologies: Anyone can read
CREATE POLICY "Technologies are publicly readable"
  ON technologies FOR SELECT
  TO public
  USING (true);

-- Projects: Anyone can read
CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT
  TO public
  USING (true);

-- Project Technologies: Anyone can read
CREATE POLICY "Project technologies are publicly readable"
  ON project_technologies FOR SELECT
  TO public
  USING (true);

-- Reviews: Anyone can read, authenticated users can create
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cart: Only authenticated users can manage their cart
CREATE POLICY "Users can manage their cart"
  ON cart_items
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wishlist: Only authenticated users can manage their wishlist
CREATE POLICY "Users can manage their wishlist"
  ON wishlists
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Purchases: Users can only view their own purchases
CREATE POLICY "Users can view their purchases"
  ON purchases
  TO authenticated
  USING (auth.uid() = user_id);