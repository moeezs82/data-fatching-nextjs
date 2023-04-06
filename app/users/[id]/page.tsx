import getUser from "@/lib/getUser";
import getUserPosts from "@/lib/getUserPosts";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";
import type { Metadata } from 'next'

type Params = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params: { id } }: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(id)
  const user: User = await userData

  return {
      title: user.name,
      description: `This is the page of ${user.name}`
  }

}

export default async function User({ params: { id } }: Params) {
  // requesting 2 api calls in parallel for better performance as recommended by next js
  const userData: Promise<User> = getUser(id);
  const userPostsData: Promise<Post[]> = getUserPosts(id);

  //   const [user, userPosts] = await Promise.all([userData, userPostsData]);
  const user = await userData;

  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Async Server Component */}
        <UserPosts posts={userPostsData} />
      </Suspense>
    </>
  );
}
