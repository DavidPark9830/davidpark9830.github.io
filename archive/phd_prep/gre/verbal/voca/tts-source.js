import { TtsSession, stored } from "@mintplex-labs/piper-tts-web";

export const VOICE_ID = "en_US-hfc_female-medium";

export async function isVoiceCached() {
  try {
    return (await stored()).includes(VOICE_ID);
  } catch {
    return false;
  }
}

export function createVoiceSession(onProgress) {
  return TtsSession.create({
    voiceId: VOICE_ID,
    progress: onProgress
  });
}
