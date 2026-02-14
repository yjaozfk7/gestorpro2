"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function Breadcrumb({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

export function BreadcrumbList({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function BreadcrumbItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  )
}

/**
 * ✅ Versão “segura” sem Slot/asChild para NÃO dar conflito de ref no build.
 * Use assim:
 * <BreadcrumbLink href="/algum-lugar">Texto</BreadcrumbLink>
 */
export function BreadcrumbLink({
  className,
  href,
  children,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string
}) {
  return (
    <Link
      href={href}
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export function BreadcrumbPage({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className)}
      {...props}
    >
      <ChevronRight />
    </li>
  )
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <span className="text-lg leading-none">…</span>
      <span className="sr-only">Mais</span>
    </span>
  )
}
