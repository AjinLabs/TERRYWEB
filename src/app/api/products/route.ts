import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { ProductSize, ProductColor } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const size = searchParams.get("size") as ProductSize | null;
    const colour = searchParams.get("colour") as ProductColor | null;
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const sort = searchParams.get("sort");

    let products = getProducts();

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.code.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (size) {
      products = products.filter((p) => p.sizes.includes(size));
    }

    if (colour) {
      products = products.filter((p) =>
        p.colours.some((c) => c.toLowerCase() === colour.toLowerCase())
      );
    }

    if (category && category !== "All") {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else {
      // Newest first by default
      products.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Administrator privilege required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      code,
      price,
      originalPrice,
      description,
      fabric,
      fit,
      availability,
      images,
      sizes,
      colours,
      category,
      isNewArrival,
      isFeatured,
    } = body;

    if (!name || !code || !price || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Product name, code, price, and at least 1 image are required." },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProduct = createProduct({
      name,
      code: code.toUpperCase(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description || "",
      fabric: fabric || "Fine Boutique Cotton / Linen Blend",
      fit: fit || "Tailored Silhouette",
      availability: availability || "In Stock",
      images: Array.isArray(images) ? images : [images],
      sizes: sizes && sizes.length ? sizes : ["M", "L", "XL"],
      colours: colours && colours.length ? colours : ["Black", "White"],
      category: category || "Dresses & Tops",
      isNewArrival: Boolean(isNewArrival),
      isFeatured: Boolean(isFeatured),
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
