import psycopg2
import sys

# Supabase connection details
DB_HOST = "aws-0-us-east-1.pooler.supabase.com"
DB_PORT = "6543"
DB_NAME = "postgres"
DB_USER = "postgres.twbppbgvcvcxktloulyp"
DB_PASSWORD = "PqT#2026!Secure$Admin"

def execute_migration():
    """Execute the blog posts migration"""
    try:
        # Connect to database
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        
        cur = conn.cursor()
        
        print("✅ Connected to Supabase database")
        
        # Read migration file
        with open('supabase_migrations/016_create_blog_posts.sql', 'r', encoding='utf-8') as f:
            migration_sql = f.read()
        
        print("📄 Migration file loaded")
        
        # Execute migration
        cur.execute(migration_sql)
        conn.commit()
        
        print("✅ Migration executed successfully")
        
        # Verify blog posts were created
        cur.execute("SELECT slug, title_es, category, status FROM blog_posts ORDER BY published_at DESC;")
        posts = cur.fetchall()
        
        print(f"\n📊 Blog posts in database ({len(posts)}):")
        for post in posts:
            print(f"  - {post[0]} | {post[1][:50]}... | {post[2]} | {post[3]}")
        
        cur.close()
        conn.close()
        
        print("\n✅ All done! Blog system is ready.")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = execute_migration()
    sys.exit(0 if success else 1)
