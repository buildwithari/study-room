import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/categories - List all categories with hierarchy
export async function GET() {
  try {
    // Get all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        parent: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    // Filter to get parent categories only
    const parentCategories = allCategories.filter(c => !c.parentId);

    // Transform to include article counts and children
    const categoriesWithCounts = parentCategories.map((category) => {
      const children = allCategories
        .filter(c => c.parentId === category.id)
        .map(child => ({
          ...child,
          articleCount: child._count.articles,
        }));

      return {
        ...category,
        articleCount: category._count.articles,
        children,
      };
    });

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      icon,
      bgColor,
      textColor,
      iconColor,
      order,
      parentId,
    } = body;

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        bgColor,
        textColor,
        iconColor,
        order: order || 0,
        parentId: parentId || null,
      },
      include: {
        parent: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
