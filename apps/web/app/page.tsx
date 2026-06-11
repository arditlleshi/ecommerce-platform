import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Heart,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Modern Storefront",
  description:
    "A frontend-only ecommerce storefront prototype with category navigation, search, collections, and hardcoded products.",
};

const departments = [
  {
    name: "New In",
    href: "#new-in",
    description: "Fresh drops, limited colorways, and seasonal edits.",
    links: ["Weekly Drops", "Trending Now", "Preorders", "Giftable"],
  },
  {
    name: "Women",
    href: "#women",
    description: "Wardrobe staples, active layers, accessories, and beauty.",
    links: ["Clothing", "Shoes", "Bags", "Skincare"],
  },
  {
    name: "Men",
    href: "#men",
    description: "Modern essentials, performance gear, and daily carry.",
    links: ["Outerwear", "Sneakers", "Grooming", "Watches"],
  },
  {
    name: "Home",
    href: "#home",
    description: "Furniture, lighting, kitchen pieces, and home scent.",
    links: ["Furniture", "Lighting", "Kitchen", "Decor"],
  },
] as const;

const heroCollections = [
  {
    label: "Utility Outerwear",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=85",
    href: "#outerwear",
  },
  {
    label: "Home Reset",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85",
    href: "#home",
  },
] as const;

const categoryTiles = [
  {
    name: "Apparel",
    count: "248 products",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=85",
    href: "#apparel",
  },
  {
    name: "Footwear",
    count: "96 products",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=85",
    href: "#footwear",
  },
  {
    name: "Home Goods",
    count: "132 products",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=85",
    href: "#home",
  },
  {
    name: "Accessories",
    count: "74 products",
    image:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=85",
    href: "#accessories",
  },
] as const;

const products = [
  {
    name: "Aero Knit Track Jacket",
    brand: "Northline",
    category: "New In",
    price: 168,
    compareAt: 220,
    rating: "4.9",
    tag: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Marble Table Lamp",
    brand: "House Form",
    category: "Home",
    price: 128,
    compareAt: 160,
    rating: "4.8",
    tag: "Editor Pick",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Field Runner Sneaker",
    brand: "Pace Studio",
    category: "Footwear",
    price: 144,
    compareAt: 180,
    rating: "4.7",
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Everyday Pebble Tote",
    brand: "Atelier Vale",
    category: "Accessories",
    price: 198,
    compareAt: 240,
    rating: "4.9",
    tag: "New Color",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
  },
] as const;

const serviceSignals = [
  {
    title: "Free 2-Day Shipping",
    description: "On orders over $75 with tracked delivery.",
    icon: Truck,
  },
  {
    title: "Easy Returns",
    description: "30-day returns with instant exchange credit.",
    icon: PackageCheck,
  },
  {
    title: "Verified Quality",
    description: "Curated brands reviewed before they launch.",
    icon: BadgeCheck,
  },
  {
    title: "Secure Checkout",
    description: "Protected payments and encrypted account data.",
    icon: ShieldCheck,
  },
] as const;

const formatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <Card className="storefront-product-card rounded-lg py-0">
      <div className="storefront-product-media relative aspect-4/5 overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge variant="secondary" className="bg-background/90 shadow-sm">
            {product.tag}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 bg-background/90 shadow-sm"
          aria-label={`Save ${product.name}`}
        >
          <Heart aria-hidden="true" />
        </Button>
      </div>
      <CardHeader className="gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-medium uppercase text-muted-foreground">
            {product.brand}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums">
            <Star
              aria-hidden="true"
              className="size-3 fill-chart-4 text-chart-4"
            />
            {product.rating}
          </span>
        </div>
        <CardTitle className="min-w-0 text-sm">
          <Link
            href="#product"
            className="line-clamp-2 hover:text-primary/70 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3 px-4 pb-4">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="font-medium tabular-nums">
            {formatter.format(product.price)}
          </span>
          <span className="text-xs text-muted-foreground line-through tabular-nums">
            {formatter.format(product.compareAt)}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          aria-label={`Add ${product.name} to cart`}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
}

function SearchForm() {
  return (
    <form
      action="#products"
      role="search"
      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-background p-1 shadow-sm focus-within:ring-2 focus-within:ring-ring/30"
    >
      <label htmlFor="site-search" className="sr-only">
        Search Products
      </label>
      <Search
        aria-hidden="true"
        className="ml-2 size-4 shrink-0 text-muted-foreground"
      />
      <Input
        id="site-search"
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Search sneakers, lamps, tote bags…"
        className="h-9 border-0 px-0 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" size="sm" className="hidden sm:inline-flex">
        Search
      </Button>
    </form>
  );
}

export default function Home() {
  return (
    <main
      id="main-content"
      className="min-h-dvh overflow-x-hidden bg-background"
    >
      <section className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <p className="min-w-0 truncate">
            New season event: up to 35% off selected edits.
          </p>
          <Link
            href="#products"
            className="shrink-0 font-medium text-primary-foreground/80 hover:text-primary-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/40"
          >
            Shop Event
          </Link>
        </div>
      </section>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="relative flex items-center gap-3">
            <details className="group lg:hidden">
              <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
                <Menu aria-hidden="true" className="size-4" />
                <span className="sr-only">Open Category Menu</span>
              </summary>
              <div className="absolute inset-x-0 top-full border-b bg-background p-4 shadow-lg">
                <div className="grid gap-3">
                  {departments.map((department) => (
                    <Link
                      key={department.name}
                      href={department.href}
                      className="rounded-lg border p-4 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    >
                      <span className="font-medium">{department.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {department.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </details>

            <Link
              href="/"
              translate="no"
              className="flex shrink-0 items-center gap-2 rounded-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag aria-hidden="true" className="size-4" />
              </span>
              <span>Northstar</span>
            </Link>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-1 lg:flex"
            >
              <div className="group relative">
                <Link
                  href="#categories"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  Shop
                  <ChevronDown aria-hidden="true" className="size-3.5" />
                </Link>
                <div className="invisible absolute left-0 top-full w-[760px] translate-y-2 opacity-0 transition-[opacity,transform,visibility] duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mt-3 grid grid-cols-[1.2fr_0.8fr] gap-5 rounded-lg border bg-background p-5 shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                      {departments.map((department) => (
                        <div key={department.name} className="min-w-0">
                          <Link
                            href={department.href}
                            className="font-medium hover:text-primary/70 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                          >
                            {department.name}
                          </Link>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {department.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {department.links.map((link) => (
                              <Link
                                key={link}
                                href="#categories"
                                className="rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                              >
                                {link}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-foreground">
                      <Sparkles aria-hidden="true" className="size-5" />
                      <p className="mt-3 text-sm font-semibold">
                        Merchandising Focus
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        Feature categories first, then spotlight a small set of
                        high-intent products instead of crowding the navbar.
                      </p>
                      <Button asChild size="sm" className="mt-4">
                        <Link href="#products">View Curated Picks</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {departments.slice(1).map((department) => (
                <Link
                  key={department.name}
                  href={department.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  {department.name}
                </Link>
              ))}
            </nav>

            <div className="ml-auto hidden min-w-[280px] flex-1 md:flex">
              <SearchForm />
            </div>

            <div className="flex items-center gap-1">
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label="Open Account"
              >
                <Link href="/account">
                  <User aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label="Open Cart"
              >
                <Link href="#cart">
                  <ShoppingBag aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <SearchForm />
          </div>
        </div>
      </header>

      <section className="relative border-b bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8 lg:py-12">
          <div className="flex flex-col justify-center gap-6">
            <Badge variant="outline" className="w-fit bg-background">
              Spring Market 2026
            </Badge>
            <div className="max-w-2xl">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Shop a curated marketplace built for fast discovery.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                Category paths stay clear, search stays visible, and the home
                page highlights edited collections before asking shoppers to
                sort through a full catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#categories">
                  Explore Categories
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-background"
              >
                <Link href="#products">Shop Featured Picks</Link>
              </Button>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-semibold tabular-nums">550+</p>
                <p className="text-muted-foreground">Curated items</p>
              </div>
              <div>
                <p className="font-semibold tabular-nums">4.8/5</p>
                <p className="text-muted-foreground">Avg. rating</p>
              </div>
              <div>
                <p className="font-semibold tabular-nums">2 days</p>
                <p className="text-muted-foreground">Fast delivery</p>
              </div>
            </div>
          </div>

          <div className="grid min-h-[420px] gap-3 sm:grid-cols-[1fr_0.72fr]">
            <Link
              href="#new-in"
              className="group relative min-h-[420px] overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                alt="Model wearing a modern layered outfit"
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-[50%_35%] transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/70 to-transparent p-5 text-primary-foreground">
                <p className="text-sm font-medium">The New Uniform</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Outerwear, knits, and daily layers
                </p>
              </div>
            </Link>
            <div className="grid gap-3">
              {heroCollections.map((collection) => (
                <Link
                  key={collection.label}
                  href={collection.href}
                  className="group relative min-h-[200px] overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <Image
                    src={collection.image}
                    alt={collection.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 28vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/65 to-transparent p-4 text-primary-foreground">
                    <p className="text-sm font-medium">{collection.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="scroll-mt-28 border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Browse By Department
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                Clear category paths before deep product lists.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="#products">
                View All Products
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTiles.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group rounded-lg border bg-card p-3 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={category.image}
                    alt={`${category.name} category`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </div>
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="storefront-deferred scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Featured Products
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                A small, merchandised set beats an overloaded homepage.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                <SlidersHorizontal aria-hidden="true" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                Best Selling
              </Button>
              <Button variant="outline" size="sm">
                Newest
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="storefront-deferred border-y bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground"
            >
              Member Access
            </Badge>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-normal">
              Loyalty, delivery, and returns shown before checkout friction.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-primary-foreground/70">
              Service details belong close to product discovery, so shoppers can
              evaluate value before they commit to a cart.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.title}
                  className="rounded-lg border border-primary-foreground/10 p-4"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-primary-foreground"
                  />
                  <p className="mt-4 font-medium">{signal.title}</p>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/65">
                    {signal.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
