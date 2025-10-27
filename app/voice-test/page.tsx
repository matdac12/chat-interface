import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import VoiceChatTest from "@/components/VoiceChatTest";

export default async function VoiceTestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <VoiceChatTest />;
}
