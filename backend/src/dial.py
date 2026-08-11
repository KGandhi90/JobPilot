import argparse
import asyncio
import os
import uuid

from dotenv import load_dotenv
from livekit import api

load_dotenv(".env.local")
load_dotenv()

async def main():
    parser = argparse.ArgumentParser(description="Dial a number via SIP")
    parser.add_argument("--to", required=True, help="The SIP URI or phone number to call (e.g., sip:user@sip.linphone.org or +15551234567)")
    args = parser.parse_args()

    phone_number = args.to
    
    # LiveKit expects just the username/number, not the full SIP URI
    sip_call_to = phone_number
    if sip_call_to.startswith("sip:"):
        sip_call_to = sip_call_to[4:]
    if "@" in sip_call_to:
        sip_call_to = sip_call_to.split("@")[0]

    room_name = f"outbound-call-{uuid.uuid4().hex[:8]}"

    # Use LIVEKIT_SIP_OUTBOUND_TRUNK_ID from env
    trunk_id = os.getenv("LIVEKIT_SIP_OUTBOUND_TRUNK_ID")
    if not trunk_id:
        print("Error: LIVEKIT_SIP_OUTBOUND_TRUNK_ID is not set in .env.local")
        print("Please follow Day 6 instructions to set up your SIP Trunk in LiveKit Cloud.")
        return

    print(f"Dialing {sip_call_to} into room {room_name} using trunk {trunk_id}...")

    lk = api.LiveKitAPI()
    try:
        # Create the room
        await lk.room.create_room(
            api.CreateRoomRequest(
                name=room_name,
                empty_timeout=10 * 60,
                max_participants=10,
            )
        )
        print(f"Room {room_name} created.")

        # Dispatch the AI agent into the room
        await lk.agent_dispatch.create_dispatch(
            api.CreateAgentDispatchRequest(
                agent_name="outbound-agent",
                room=room_name,
            )
        )
        print(f"Agent 'outbound-agent' dispatched.")

        # Dispatch the SIP participant (call the user)
        sip_request = api.CreateSIPParticipantRequest(
            sip_trunk_id=trunk_id,
            sip_call_to=sip_call_to,
            room_name=room_name,
            participant_identity=f"sip-{sip_call_to}",
        )
        
        await lk.sip.create_sip_participant(sip_request)
        print(f"\n✅ Dispatched SIP participant. Your phone should be ringing now!")
        print(f"Note: Make sure your outbound_agent.py is running to answer the room!")
        
    except Exception as e:
        print(f"\n❌ Failed to dial: {e}")
    finally:
        await lk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
