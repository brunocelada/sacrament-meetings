import { connection } from "next/server";

export default async function Footer() {
  await connection();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 sm:text-lg text-sm text-white py-2 sm:py-4 mt-12">
      <div className="container mx-auto text-center">
        <p>Copyright &copy;{year} | Bruno Celada | All rights reserved</p>
      </div>
    </footer>
  );
}
