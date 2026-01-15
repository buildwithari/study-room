import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/categories/[slug] - Get category with its articles
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
        parent: true,
        articles: {
          where: { status: 'published' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            subtitle: true,
            slug: true,
            difficulty: true,
            timeComplexity: true,
            spaceComplexity: true,
            approach: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
