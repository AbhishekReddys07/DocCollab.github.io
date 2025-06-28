/*
  # DocCollab Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `username` (text, unique, not null)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, json content)
      - `author_id` (uuid, references users)
      - `last_modified_at` (timestamp)
      - `visibility` (enum: public/private)
      - `created_at` (timestamp)
      - `search_text` (tsvector, generated for full-text search)
    
    - `document_shares`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `user_id` (uuid, references users)
      - `can_edit` (boolean)
      - `created_at` (timestamp)
    
    - `document_versions`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `user_id` (uuid, references users)
      - `content` (text, snapshot)
      - `created_at` (timestamp)
    
    - `mentions`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `mentioned_user_id` (uuid, references users)
      - `mentioning_user_id` (uuid, references users)
      - `is_read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Secure document sharing and mentions

  3. Indexes
    - Full-text search index on documents
    - Performance indexes on foreign keys
*/

-- Create enum for document visibility
CREATE TYPE document_visibility AS ENUM ('public', 'private');

-- Users table (profiles for auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Document',
  content text DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}',
  author_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  last_modified_at timestamptz DEFAULT now(),
  visibility document_visibility DEFAULT 'private',
  created_at timestamptz DEFAULT now()
);

-- Add full-text search column
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS search_text tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
) STORED;

-- Document shares table
CREATE TABLE IF NOT EXISTS document_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  can_edit boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(document_id, user_id)
);

-- Document versions table
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Mentions table
CREATE TABLE IF NOT EXISTS mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  mentioned_user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mentioning_user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents USING GIN (search_text);
CREATE INDEX IF NOT EXISTS documents_author_idx ON documents (author_id);
CREATE INDEX IF NOT EXISTS documents_visibility_idx ON documents (visibility);
CREATE INDEX IF NOT EXISTS document_shares_document_idx ON document_shares (document_id);
CREATE INDEX IF NOT EXISTS document_shares_user_idx ON document_shares (user_id);
CREATE INDEX IF NOT EXISTS document_versions_document_idx ON document_versions (document_id);
CREATE INDEX IF NOT EXISTS mentions_user_idx ON mentions (mentioned_user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for documents table
CREATE POLICY "Users can read public documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (visibility = 'public');

CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can read shared documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM document_shares
      WHERE document_shares.document_id = documents.id
      AND document_shares.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Shared users can update documents if they have edit permission"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM document_shares
      WHERE document_shares.document_id = documents.id
      AND document_shares.user_id = auth.uid()
      AND document_shares.can_edit = true
    )
  );

CREATE POLICY "Authors can delete own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for document_shares table
CREATE POLICY "Users can read shares for their documents"
  ON document_shares
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_shares.document_id
      AND documents.author_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Document authors can manage shares"
  ON document_shares
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_shares.document_id
      AND documents.author_id = auth.uid()
    )
  );

-- RLS Policies for document_versions table
CREATE POLICY "Users can read versions of accessible documents"
  ON document_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_versions.document_id
      AND (
        documents.author_id = auth.uid()
        OR documents.visibility = 'public'
        OR EXISTS (
          SELECT 1 FROM document_shares
          WHERE document_shares.document_id = documents.id
          AND document_shares.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create versions for editable documents"
  ON document_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_versions.document_id
      AND (
        documents.author_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM document_shares
          WHERE document_shares.document_id = documents.id
          AND document_shares.user_id = auth.uid()
          AND document_shares.can_edit = true
        )
      )
    )
  );

-- RLS Policies for mentions table
CREATE POLICY "Users can read their mentions"
  ON mentions
  FOR SELECT
  TO authenticated
  USING (mentioned_user_id = auth.uid());

CREATE POLICY "Users can create mentions"
  ON mentions
  FOR INSERT
  TO authenticated
  WITH CHECK (mentioning_user_id = auth.uid());

CREATE POLICY "Users can update their mentions"
  ON mentions
  FOR UPDATE
  TO authenticated
  USING (mentioned_user_id = auth.uid())
  WITH CHECK (mentioned_user_id = auth.uid());

-- Function to update document's last_modified_at timestamp
CREATE OR REPLACE FUNCTION update_document_modified_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update last_modified_at
CREATE TRIGGER update_documents_modified_time
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_modified_time();