import NextAuth from "next-auth";
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['identify', 'guilds', 'guilds.members.read'].join(' ')
let access_token

export const authOptions = {
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token
                token.id = profile.id
            }
            return token
        },
        async signIn({ user, account, profile, email, credentials }) {
            access_token = account.access_token
            return true
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            session.user.id = token.id

            return session
        }
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: {params: {scope: scopes}}
        })
    ]
}

export default NextAuth(authOptions)