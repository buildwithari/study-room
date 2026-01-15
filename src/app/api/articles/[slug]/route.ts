import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/articles/[slug] - Get single article
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // If article is draft, only allow authenticated users to view
    if (article.status === 'draft') {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[slug] - Update article (protected)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check for conflicts
    if (body.slug && body.slug !== slug) {
      const slugConflict = await prisma.article.findUnique({
        where: { slug: body.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'An article with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const article = await prisma.article.update({
      where: { slug },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        slug: body.slug,
        categoryId: body.categoryId,
        difficulty: body.difficulty,
        timeComplexity: body.timeComplexity,
        spaceComplexity: body.spaceComplexity,
        approach: body.approach,
        blocks: body.blocks,
        status: body.status,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[slug] - Delete article (protected)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
