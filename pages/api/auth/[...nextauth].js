import NextAuth from "next-auth";
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['identify', 'guilds', 'guilds.members.read'].join(' ')


export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: {params: {scope: scopes}}
        })
    ]
}

export default NextAuth(authOptions)