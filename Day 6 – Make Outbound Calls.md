# Day 6 – Make Outbound Calls

Yesterday your agent waited to be called over the browser. Today, it will be making outbound calls.

> IMPORTANT: You need a telephony service like Twilio to make outbound calls. If your Twilio free trial is exhausted, you can use [Linphone](https://linphone.org/en/) to make outbound calls. See the [supplementary material](../supplementary/outbound-over-linphone.md) for more details.

For Day 6, your objective is to:

- **Step 1: Find the outbound use case for your track.**

  Examples of outbound use cases by track:

  | Track               | Call trigger                                                              |
  | ------------------- | ------------------------------------------------------------------------- |
  | Learning & Literacy | Daily practice call at a time the learner picked                          |

- **Step 2: Integrate a Telephony Service.** Integrate a service like Twilio to your agent. See the [example project](https://github.com/murf-ai/murf-cookbook/tree/main/examples/agents/payment-reminder-agent) for reference.

- **Step 3: Have your agent call you**, or a number you control, and complete the interaction.

- **Step 4: Open the call properly.** Outbound is harder than inbound because the user didn't ask for this and doesn't know who you are. In the first two sentences: say who's calling, why, and how to make it stop.

- **Step 5: Record a short video** of the phone ringing and the call playing out.

- **Step 6: Post the video on LinkedIn** with a description of what you built on Day 6. Mention that you're building a voice agent using the fastest TTS API — **Murf Falcon**. Mention that you're part of **10 Days of Voice Agents** and don't forget to tag the official **Murf AI** handle. Also use the hashtag **#VoiceForBharat**.

- **Step 7: Submit your post link** on the submission form, along with your name and email.

## Advanced (Optional)

You only need the steps above to complete Day 6. These are for going the extra mile:

- **Outcome Handling**: Handle the outcomes inbound never has: no answer, busy, voicemail, and an immediate hang-up. Each needs a defined behaviour and a retry rule.

### You've finished Day 6 if:

- Your agent places a call and delivers something useful
- The opening states who is calling, why, and how to opt out

Once your agent is making calls, your LinkedIn post is live and your form submission is in, you've completed Day 6.

## Resources

- [Outbound Call Example Project Video](https://www.youtube.com/watch?v=qh0RoYac0No)
- [Outbound Call Example Project Code](https://github.com/murf-ai/murf-cookbook/tree/main/examples/agents/payment-reminder-agent)
- [Make Outbound Calls](https://docs.livekit.io/telephony/making-calls/outbound-calls/)
- [LiveKit Telephony](https://docs.livekit.io/telephony/)
- [LiveKit Agent Examples](https://github.com/livekit-examples/python-agents-examples)

# Outbound calls over Linphone

If your Twilio free trial is exhausted, you can try to use [Linphone](https://www.linphone.org/en/) to make outbound calls.

## Steps

Follow these steps to make outbound calls over linphone:

### 1. Set up a Linphone account

- Go to [linphone.org](https://subscribe.linphone.org/register/email) and create a new account.

- After the account is created, you will receive your SIP address, which is usually `sip:<your-username>@sip.linphone.org`. Make a note of this.

### 2. Update livekit starter

- (If you're not using the livekit starter, skip this step)
- Go to https://github.com/murf-ai/murf-livekit-starter and get the latest code
- If there are conflicts, you can just manually add the files in https://github.com/murf-ai/murf-livekit-starter/tree/main/backend/src/telephony/outbound to your project.

### 3. Set up Livekit cloud

- If you haven't already, create a new Livekit account at [livekit.com](https://cloud.livekit.io/login).

- Create a new project and fetch your Livekit URL, API key, and API secret; Save these as `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` in your `.env` (or `.env.local`) file in the `/backend` folder.

### 4. Create a trunk

- In Livekit cloud, under the Telephony section, click on "SIP Trunks"
- Create a new outbound trunk with the following details:

```json
{
  "name": "linphone-trunk",
  "address": "sip.linphone.org",
  "transport": "SIP_TRANSPORT_TLS",
  "numbers": ["sip:<your-linphone-username>"]
}
```

- After the trunk is created, you will receive a TRUNK ID. Save this as `LIVEKIT_SIP_OUTBOUND_TRUNK_ID` in your .env file in the `/backend` folder.

### 5. Set up Linphone app

- Download and install the Linphone app for your phone. Log in with the linphone.org credentials.

- After you've logged in, you will need to give the app permission to access the microphone.

- Then in the linphone app, go to Settings -> Calls -> Advanced calls settings -> Turn "Media encryption mandatory" OFF.

### 6. Start the agent

- In the livekit starter, go to the `/backend` folder
- First run the agent using - `uv run python src/telephony/outbound/agent.py dev`
- Then make a call to your Linphone account - `uv run python src/telephony/outbound/dial.py --to <your-linphone-username>`
- You will receive a call on your Linphone app, and you can start talking to the agent.

- If you're not using the livekit starter, you can still refer to the code in https://github.com/murf-ai/murf-livekit-starter/tree/main/backend/src/telephony/outbound to implement your own solution.