import getAllUsers from "@/lib/getAllUsers"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Users",
    description: "Users page here"
}

export default async function Users() {

    const usersData: Promise<User[]> = getAllUsers()

    const users = await usersData

    const content = (
        <section>
            <h2>
                <Link href='/'>Back to Home</Link>
            </h2>
            <br />
            {users.map(user => {
                return (
                    <div key={user.id}>
                        <p>
                            <Link href={`/users/${user.id}`}>{user.name}</Link>
                        </p>
                        <br />
                    </div>
                )
            })}
        </section>
    )

  return content
}
