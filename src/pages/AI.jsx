import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';

// ── Palette ─────────────────────────────────────────────────────────────────
const GREEN  = '#01bf71';
const ORANGE = '#e67e22';
const PURPLE = '#9b59b6';

// ── Node info for modals ─────────────────────────────────────────────────────
const NODE_INFO = {
  start: {
    title: 'Patient Calls In',
    fn: null,
    what: 'The patient dials the clinic number. The voice agent answers immediately - no hold music, no IVR menu. Deepgram STT starts streaming audio in real time.',
    inputs: 'Incoming phone call',
    outputs: 'Session initialized',
  },
  s1: {
    title: 'Collect Mobile Number',
    fn: 'register_mobile()',
    what: 'The agent asks the patient to state their mobile number, then reads it back digit by digit to confirm accuracy. The number becomes the primary lookup key for identity.',
    inputs: 'Spoken digits from patient',
    outputs: 'Mobile number confirmed and stored',
  },
  s2: {
    title: 'Detect Intent',
    fn: 'set_intent()',
    what: 'GPT-4o-mini classifies whether the patient wants to book an appointment or leave a note for the doctor. This single decision drives the entire downstream flow.',
    inputs: "Patient's spoken intent",
    outputs: 'Intent set: "booking" or "note"',
  },
  intent: {
    title: 'Booking or Note?',
    fn: 'Router',
    what: 'A routing decision based on the detected intent. The state machine branches left into the booking path or right into the note path. If intent is ambiguous, the agent re-prompts.',
    inputs: 'Intent value from set_intent()',
    outputs: 'Branch: booking path or note path',
  },
  b1: {
    title: 'New or Returning Patient?',
    fn: 'set_patient_type()',
    what: 'The agent asks whether the patient has visited the clinic before. The answer determines which identity verification flow runs - DOB lookup for returning, name spell-out for new.',
    inputs: "Patient's spoken response",
    outputs: 'Patient type set: "returning" or "new"',
  },
  b2a: {
    title: 'Returning — Verify DOB',
    fn: 'fetch_patient()',
    what: 'For returning patients, the agent collects date of birth, reads it back in natural format (e.g. "March 12th, 1985"), and waits for confirmation. Then looks up the patient in SQL Server (tblPatients) by cellphone column.',
    inputs: 'Spoken date of birth',
    outputs: 'Patient name + DOB returned from SQL Server',
  },
  b2b: {
    title: 'New — Spell Name + DOB',
    fn: 'register_new_patient()',
    what: 'For new patients, the agent asks them to spell their name letter by letter, reads it back, confirms, then collects date of birth. The name relay guard captures any corrections made mid-spelling.',
    inputs: 'Spelled name + spoken DOB',
    outputs: 'New patient name and DOB registered',
  },
  b3: {
    title: 'Check Availability',
    fn: 'check_availability()',
    what: "The agent asks for the patient's preferred date and time, then calls GET /availability with those params. It presents the returned slots conversationally and waits for the patient to choose.",
    inputs: 'Preferred date and time (spoken)',
    outputs: 'Available slots returned from Availability API',
  },
  b4: {
    title: 'Confirm & Book',
    fn: 'book_appointment()',
    what: 'The agent states all appointment details in a single sentence - name, date, time, patient type, and waits for a yes. On confirmation, the booking is saved to the Appointments tab in Google Sheets.',
    inputs: 'Patient confirmation ("yes")',
    outputs: 'Row saved to Google Sheets: name, timestamp, DOB, date, time, patient type',
  },
  done_book: {
    title: 'Session Closes',
    fn: null,
    what: 'The agent thanks the patient and ends the call. The done state guard activates, blocking any further function calls. Session cost (Deepgram STT/TTS + GPT-4o-mini tokens) is logged.',
    inputs: 'Booking confirmed',
    outputs: 'Call ends · Session cost tracked',
  },
  n1: {
    title: 'Spell Name Letter by Letter',
    fn: 'name confirmed',
    what: 'The agent asks the patient to spell their name so it can be accurately attributed to the note. Reads it back and waits for confirmation. The name override relay guard handles mid-spell corrections.',
    inputs: 'Spelled name from patient',
    outputs: 'Name confirmed for note attribution',
  },
  n2: {
    title: 'Collect Note Content',
    fn: 'leave_note()',
    what: "The agent asks the patient what they'd like to communicate to the doctor. It reads the note back verbatim and waits for confirmation. On confirm, saved to the Notes tab in Google Sheets.",
    inputs: 'Spoken note content',
    outputs: 'Row saved to Google Sheets: name, mobile, timestamp, note content',
  },
  done_note: {
    title: 'Session Closes',
    fn: null,
    what: 'The agent thanks the patient and ends the call. The done state guard activates, blocking any further function calls. Session cost is logged.',
    inputs: 'Note confirmed',
    outputs: 'Call ends · Session cost tracked',
  },
};

// ── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px 60px;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 90px 16px 40px;
  }
`;

const Title = styled.h1`
  margin-top: 25px;
  color: #111;
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-top: 16px;
  }
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1rem;
  margin-bottom: 48px;
  text-align: center;
  max-width: 620px;
  line-height: 1.65;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 28px;
  }
`;

const NarrativeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }
`;

const NarrativeCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-left: 3px solid ${p => p.accent || GREEN};
  border-radius: 10px;
  padding: 20px 22px;
`;

const CardLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${p => p.accent || GREEN};
  margin-bottom: 8px;
`;

const CardText = styled.p`
  font-size: 13px;
  color: #444;
  line-height: 1.6;
  margin: 0;
`;

const FlowSection = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const FlowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const FlowTitle = styled.h2`
  color: #111;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #555;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.color};
`;

const MiniMapWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const FlowWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  height: 820px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #c8c8c8;
  background: #e8e8e8;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 500px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    height: 420px;
  }
`;

const ClickHint = styled.p`
  font-size: 13px;
  color:rgb(5, 122, 73);
  font-weight: 600;
  text-align: center;
  margin: 12px 0 0;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// ── Modal ────────────────────────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 32px 36px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  position: relative;

  @media (max-width: 768px) {
    padding: 24px 22px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 20px 18px;
    border-radius: 10px;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #aaa;
  line-height: 1;
  padding: 4px;

  &:hover { color: #333; }

  @media (max-width: 480px) {
    font-size: 26px;
    top: 10px;
    right: 12px;
  }
`;

const ModalTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${p => p.color};
  background: ${p => p.color}18;
  border: 1px solid ${p => p.color}30;
  border-radius: 20px;
  padding: 3px 10px;
  display: inline-block;
  margin-bottom: 12px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 0 6px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ModalFn = styled.div`
  font-family: monospace;
  font-size: 12px;
  color: ${p => p.color};
  background: ${p => p.color}12;
  border: 1px solid ${p => p.color}28;
  border-radius: 5px;
  padding: 4px 10px;
  display: inline-block;
  margin-bottom: 16px;
`;

const ModalWhat = styled.p`
  font-size: 14px;
  color: #444;
  line-height: 1.7;
  margin: 0 0 20px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ModalRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ModalChip = styled.div`
  flex: 1;
  background: #f6f6f6;
  border-radius: 8px;
  padding: 10px 14px;
`;

const ChipLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 4px;
`;

const ChipText = styled.div`
  font-size: 12px;
  color: #333;
  line-height: 1.5;
`;

// ── Node factory ─────────────────────────────────────────────────────────────
const makeNode = (color) => ({
  background: '#f9f9f9',
  color: '#111',
  border: `1.5px solid ${color}`,
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 12,
  fontFamily: 'inherit',
  width: 190,
  textAlign: 'center',
  lineHeight: 1.5,
  cursor: 'pointer',
});

const Label = ({ main, fn, color }) => (
  <div>
    <div style={{ fontWeight: 600, marginBottom: fn ? 5 : 0 }}>{main}</div>
    {fn && (
      <div style={{
        fontSize: 10, fontFamily: 'monospace', color,
        background: `${color}18`, border: `1px solid ${color}30`,
        borderRadius: 4, padding: '2px 7px',
        display: 'inline-block', marginTop: 2,
      }}>
        {fn}
      </div>
    )}
  </div>
);

// ── Nodes ────────────────────────────────────────────────────────────────────
const initialNodes = [
  { id: 'start',  position: { x: 435, y: 0    }, style: makeNode(GREEN),
    data: { label: <Label main="📞 Patient Calls In" /> } },
  { id: 's1',     position: { x: 435, y: 110  }, style: makeNode(GREEN),
    data: { label: <Label main="🎙️ Collect Mobile Number" fn="register_mobile()" color={GREEN} /> } },
  { id: 's2',     position: { x: 435, y: 240  }, style: makeNode(GREEN),
    data: { label: <Label main="🧠 Detect Intent" fn="set_intent()" color={GREEN} /> } },
  { id: 'intent', position: { x: 435, y: 365  }, style: makeNode(PURPLE),
    data: { label: <Label main="⬡  Booking or Note?" color={PURPLE} /> } },

  { id: 'b1',     position: { x: 110, y: 500  }, style: makeNode(GREEN),
    data: { label: <Label main="👤 New or Returning?" fn="set_patient_type()" color={GREEN} /> } },
  { id: 'b2a',    position: { x: 0,   y: 650  }, style: makeNode(GREEN),
    data: { label: <Label main="🔁 Returning — Verify DOB" fn="fetch_patient()" color={GREEN} /> } },
  { id: 'b2b',    position: { x: 230, y: 650  }, style: makeNode(ORANGE),
    data: { label: <Label main="✨ New — Spell Name + DOB" fn="register_new_patient()" color={ORANGE} /> } },
  { id: 'b3',     position: { x: 95,  y: 800  }, style: makeNode(GREEN),
    data: { label: <Label main="📅 Check Availability" fn="check_availability()" color={GREEN} /> } },
  { id: 'b4',     position: { x: 95,  y: 930  }, style: makeNode(GREEN),
    data: { label: <Label main="✅ Confirm & Book" fn="book_appointment()" color={GREEN} /> } },
  { id: 'done_book', position: { x: 130, y: 1060 },
    style: { ...makeNode(GREEN), background: 'rgba(1,191,113,0.15)' },
    data: { label: <Label main="🏁 Goodbye" /> } },

  { id: 'n1',     position: { x: 760, y: 500  }, style: makeNode(ORANGE),
    data: { label: <Label main="✍️ Spell Name Letter by Letter" fn="name confirmed" color={ORANGE} /> } },
  { id: 'n2',     position: { x: 760, y: 650  }, style: makeNode(ORANGE),
    data: { label: <Label main="📝 Collect Note Content" fn="leave_note()" color={ORANGE} /> } },
  { id: 'done_note', position: { x: 790, y: 800 },
    style: { ...makeNode(ORANGE), background: 'rgba(230,126,34,0.15)' },
    data: { label: <Label main="🏁 Goodbye" /> } },
];

// ── Edges ────────────────────────────────────────────────────────────────────
const initialEdges = [
  { id: 'e01', source: 'start',  target: 's1',        animated: true,  style: { stroke: GREEN  } },
  { id: 'e02', source: 's1',     target: 's2',        animated: true,  style: { stroke: GREEN  } },
  { id: 'e03', source: 's2',     target: 'intent',    animated: true,  style: { stroke: PURPLE } },
  { id: 'e04', source: 'intent', target: 'b1',  label: 'Booking',   style: { stroke: GREEN  } },
  { id: 'e05', source: 'intent', target: 'n1',  label: 'Note',      style: { stroke: ORANGE } },
  { id: 'e06', source: 'b1',     target: 'b2a', label: 'Returning', style: { stroke: GREEN  } },
  { id: 'e07', source: 'b1',     target: 'b2b', label: 'New',       style: { stroke: ORANGE } },
  { id: 'e08', source: 'b2a',    target: 'b3',        animated: true,  style: { stroke: GREEN  } },
  { id: 'e09', source: 'b2b',    target: 'b3',        animated: true,  style: { stroke: GREEN  } },
  { id: 'e10', source: 'b3',     target: 'b4',        animated: true,  style: { stroke: GREEN  } },
  { id: 'e11', source: 'b4',     target: 'done_book', animated: true,  style: { stroke: GREEN  } },
  { id: 'e12', source: 'n1',     target: 'n2',        animated: true,  style: { stroke: ORANGE } },
  { id: 'e13', source: 'n2',     target: 'done_note', animated: true,  style: { stroke: ORANGE } },
];

// ── Accent helper ────────────────────────────────────────────────────────────
const accentFor = (id) => {
  if (['b2b', 'n1', 'n2', 'done_note'].includes(id)) return ORANGE;
  if (id === 'intent') return PURPLE;
  return GREEN;
};

// ── Component ─────────────────────────────────────────────────────────────────
const AI = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeNode, setActiveNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_, node) => {
    if (NODE_INFO[node.id]) setActiveNode(node.id);
  }, []);

  const info   = activeNode ? NODE_INFO[activeNode] : null;
  const accent = activeNode ? accentFor(activeNode) : GREEN;

  return (
    <PageWrapper>
      <Title>MDRhythm Voice Agent</Title>
      <Subtitle>
        One area where I excel as an AI PM: building agentic voice workflows from scratch,
        architecting the state machine, writing the prompts, and running a real clinic trial.
      </Subtitle>

      <NarrativeGrid>
        <NarrativeCard accent={GREEN}>
          <CardLabel accent={GREEN}>The Feature</CardLabel>
          <CardText>
            A real-time voice scheduling agent trialled at a small GI clinic in the
            Bronx. Patients call in, get identified by phone number, then either
            book an appointment or leave a note — no staff needed for routine calls.
          </CardText>
        </NarrativeCard>
        <NarrativeCard accent={PURPLE}>
          <CardLabel accent={PURPLE}>How I Built It</CardLabel>
          <CardText>
            I designed the LangGraph state machine, wrote the GPT-4o-mini intent
            prompts, wired the Deepgram WebSocket pipeline, and debugged audio
            encoding at the binary level. PM and builder on the same ticket.
          </CardText>
        </NarrativeCard>
        <NarrativeCard accent={ORANGE}>
          <CardLabel accent={ORANGE}>Why It Matters</CardLabel>
          <CardText>
            AI features fail at the seams — between STT and intent, between intent
            and action. Being in the code means I catch those gaps before they
            become missed appointments or patient-facing errors.
          </CardText>
        </NarrativeCard>
      </NarrativeGrid>

      <FlowSection>
        <FlowHeader>
          <FlowTitle>Orchestration Flow</FlowTitle>
          <Legend>
            <LegendItem><LegendDot color={GREEN} />Booking path</LegendItem>
            <LegendItem><LegendDot color={ORANGE} />Note path / New patient</LegendItem>
            <LegendItem><LegendDot color={PURPLE} />Intent routing</LegendItem>
            <LegendItem>
              <div style={{ width: 24, height: 2, background: GREEN,
                backgroundImage: 'linear-gradient(90deg,#01bf71 60%,transparent 60%)',
                backgroundSize: '8px 2px' }} />
              Animated = live data flow
            </LegendItem>
          </Legend>
        </FlowHeader>

        <FlowWrapper>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            colorMode="light"
            zoomOnScroll={false}
            zoomOnPinch={true}
          >
            <Background color="#bbb" gap={20} />
            <Controls />
            <MiniMapWrapper>
              <MiniMap nodeColor={() => GREEN} maskColor="rgba(255,255,255,0.6)" />
            </MiniMapWrapper>
          </ReactFlow>
        </FlowWrapper>
        <ClickHint>Tap any node to learn what it does</ClickHint>
      </FlowSection>

      {/* Modal */}
      {info && (
        <Overlay onClick={() => setActiveNode(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalClose onClick={() => setActiveNode(null)}>×</ModalClose>
            <ModalTag color={accent}>{info.fn ? 'Function' : 'Step'}</ModalTag>
            <ModalTitle>{info.title}</ModalTitle>
            {info.fn && <ModalFn color={accent}>{info.fn}</ModalFn>}
            <ModalWhat>{info.what}</ModalWhat>
            <ModalRow>
              <ModalChip>
                <ChipLabel>Input</ChipLabel>
                <ChipText>{info.inputs}</ChipText>
              </ModalChip>
              <ModalChip>
                <ChipLabel>Output</ChipLabel>
                <ChipText>{info.outputs}</ChipText>
              </ModalChip>
            </ModalRow>
          </ModalBox>
        </Overlay>
      )}
    </PageWrapper>
  );
};

export default AI;