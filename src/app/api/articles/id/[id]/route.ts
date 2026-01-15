import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/articles/id/[id] - Get article by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: {
          include: { parent: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

// PUT /api/articles/id/[id] - Update article by ID
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const article = await prisma.article.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE /api/articles/id/[id] - Delete article by ID
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
