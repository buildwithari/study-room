import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/articles - List articles with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};

    // Filter by category
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    // Filter by status (only show published for non-authenticated users)
    const session = await getServerSession(authOptions);
    if (status && session) {
      where.status = status;
    } else if (!session) {
      where.status = 'published';
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create new article (protected)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      slug,
      categoryId,
      difficulty,
      timeComplexity,
      spaceComplexity,
      approach,
      blocks,
      status = 'draft',
    } = body;

    // Validate required fields
    if (!title || !slug || !categoryId) {
      return NextResponse.json(
        { error: 'Title, slug, and categoryId are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        subtitle,
        slug,
        categoryId,
        difficulty,
        timeComplexity,
        spaceComplexity,
        approach,
        blocks: blocks || [],
        status,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
