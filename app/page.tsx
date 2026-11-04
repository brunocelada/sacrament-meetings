import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 flex-1 flex flex-col">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Sacrament Meetings</h1>
        <p className="text-base text-gray-700">
          This application helps bishoprics and branch leaders plan and review
          meeting agendas. It also allows members to view and print current and
          past programs. The application tracks announcements, prayers, ward
          business, hymns, musical numbers, and speakers.
        </p>
      </section>
    </main>
  );
}
