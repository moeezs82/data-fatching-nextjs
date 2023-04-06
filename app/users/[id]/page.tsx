import getUser from "@/lib/getUser";
import getUserPosts from "@/lib/getUserPosts";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";
import type { Metadata } from "next";
import getAllUsers from "@/lib/getAllUsers";
import { notFound } from "next/navigation";

type Params = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(id);
  const user: User = await userData;

  if (!user.name) {
    return {
      title: "User not found",
    };
  }

  return {
    title: user.name,
    description: `This is the page of ${user.name}`,
  };
}

export default async function UserPage({ params: { id } }: Params) {
  const userData: Promise<User> = getUser(id);
  const userPostsData: Promise<Post[]> = getUserPosts(id);

  // If not progressively rendering with Suspense, use Promise.all
  //const [user, userPosts] = await Promise.all([userData, userPostsData])

  const user = await userData;

  if (user && !user.name) return notFound()

  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Server Component */}
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  );
}

//help generate static page generation
export async function generateStaticParams() {
  // by sending this request we are making another request next deduplicate it for us
  const usersData: Promise<User[]> = getAllUsers();
  const users = await usersData;

  return users.map((user) => ({ id: user.id.toString() }));
}
