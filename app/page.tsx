import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto px-4 flex-1 flex flex-col">
      <section className="text-center">
        <div className="relative w-full max-w-[1200px] mx-auto h-60 overflow-hidden rounded-md">
          <Image
            className="object-cover"
            src="/hymns-banner.jpg"
            alt="Hymns Banner"
            fill
            loading="eager"
            priority
          />
        </div>
        <h1 className="sm:text-4xl text-2xl font-bold my-4 font-heading">
          Sacrament Meetings
        </h1>
        <p className="text-base text-gray-700 font-heading">
          This application helps bishoprics and branch leaders plan and review
          meeting agendas. It also allows members to view and print current and
          past programs. The application tracks announcements, prayers, ward
          business, hymns, musical numbers, and speakers.
        </p>
      </section>
    </main>
  );
}
