import React, { useCallback } from 'react';
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

const PageWrapper = styled.div`
  background: #010606;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 24px 60px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #aaa;
  font-size: 1rem;
  margin-bottom: 40px;
  text-align: center;
  max-width: 600px;
`;

const FlowWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  height: 620px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #1a1a1a;
`;

const nodeStyle = (color = '#01bf71') => ({
  background: '#111',
  color: '#fff',
  border: `2px solid ${color}`,
  borderRadius: 10,
  padding: '10px 16px',
  fontSize: 13,
  fontFamily: 'inherit',
  width: 180,
  textAlign: 'center',
});

const initialNodes = [
  {
    id: '1',
    position: { x: 460, y: 0 },
    data: { label: '📞 Patient Calls In' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '2',
    position: { x: 460, y: 100 },
    data: { label: '🎙️ Voice AI Answers\n(GPT-4o)' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '3',
    position: { x: 460, y: 200 },
    data: { label: '🔐 Identity Verification\n(HIPAA-compliant)' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '4',
    position: { x: 220, y: 320 },
    data: { label: '❌ Verification Failed' },
    style: nodeStyle('#e74c3c'),
  },
  {
    id: '5',
    position: { x: 700, y: 320 },
    data: { label: '✅ Verification Passed' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '6',
    position: { x: 220, y: 430 },
    data: { label: '👤 Route to Human Agent' },
    style: nodeStyle('#e67e22'),
  },
  {
    id: '7',
    position: { x: 700, y: 430 },
    data: { label: '🧠 LangGraph Agentic\nWorkflow' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '8',
    position: { x: 530, y: 530 },
    data: { label: '📅 Care Coordination\n& Scheduling' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '9',
    position: { x: 530, y: 630 },
    data: { label: '📋 Clinician Notified\n& Record Updated' },
    style: nodeStyle('#01bf71'),
  },
  {
    id: '10',
    position: { x: 120, y: 520 },
    data: { label: '🔁 Retry or Escalate' },
    style: nodeStyle('#e67e22'),
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#01bf71' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#01bf71' } },
  { id: 'e3-4', source: '3', target: '4', label: 'Fail', style: { stroke: '#e74c3c' } },
  { id: 'e3-5', source: '3', target: '5', label: 'Pass', style: { stroke: '#01bf71' } },
  { id: 'e4-6', source: '4', target: '6', style: { stroke: '#e67e22' } },
  { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#01bf71' } },
  { id: 'e6-10', source: '6', target: '10', style: { stroke: '#e67e22' } },
  { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#01bf71' } },
  { id: 'e8-9', source: '8', target: '9', animated: true, style: { stroke: '#01bf71' } },
];

const AI = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <PageWrapper>
      <Title>Voice AI Agent</Title>
      <Subtitle>
        Real-time voice agent built at MDRhythm — automating patient identity
        verification and care coordination using LangGraph + GPT-4o.
      </Subtitle>
      <FlowWrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Background color="#1a1a1a" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={() => '#01bf71'}
            maskColor="rgba(0,0,0,0.6)"
          />
        </ReactFlow>
      </FlowWrapper>
    </PageWrapper>
  );
};

export default AI;
