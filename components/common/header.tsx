"use client";
import NavLink from "./nav-link";
import { FileText } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="container flex justify-between lg:justify-center items-center py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="text-xl lg:text-2xl font-extrabold text-gray-900">
            Consisco
          </span>
        </NavLink>
      </div>

      <div className="flex lg:flex-1 lg:justify-center gap-4 lg:gap-12 lg:items-center">
        <NavLink href="/#pricing">Pricing</NavLink>
        <SignedIn>
          <NavLink href="/dashboard">Summaries</NavLink>
        </SignedIn>
      </div>

      <div className="flex lg:flex-1 lg:justify-end items-center gap-4">
        <SignedIn>
          <NavLink
            href="/upload"
            className="text-gray-800 hover:text-black transition"
          >
            Upload a PDF
          </NavLink>
          <div>Pro</div>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Link
            href="/sign-in"
            className="text-gray-800 hover:text-black transition"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}
