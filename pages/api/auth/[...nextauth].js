import NextAuth from "next-auth";
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['identify', 'guilds', 'guilds.members.read'].join(' ')
let guildData
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
            await fetch('https://discord.com/api/users/@me/guilds/1081469674807640144/member', {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => guildData = data)
            session.accessToken = token.accessToken
            session.user.id = token.id
            session.user.guild = guildData

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