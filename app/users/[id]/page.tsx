import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts"
import type { Metadata } from 'next'

type Params = {
    params: {
        id: string
    }
}

export async function generateMetadata({ params: { id } }: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(id)
    const user: User = await userData

    return {
        title: user.name,
        description: `This is the page of ${user.name}`
    }

}

export default async function UserPage({ params: { id } }: Params) {
    const userData: Promise<User> = getUser(id)
    const userPostsData: Promise<Post[]> = getUserPosts(id)

    // If not progressively rendering with Suspense, use Promise.all
    //const [user, userPosts] = await Promise.all([userData, userPostsData])

    const user = await userData

    return (
        <>
            <h2>{user.name}</h2>
            <br />
            <Suspense fallback={<h2>Loading...</h2>}>
                {/* @ts-expect-error Server Component */}
                <UserPosts promise={userPostsData} />
            </Suspense>
        </>
    )
}