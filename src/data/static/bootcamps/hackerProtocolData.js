import bootcampEmblem from '../../../assets/images/bootcamps/hacker-protocol/emblem/hacker-protocol-bootcamp-emblem.webp';
import awakeningEmblem from '../../../assets/images/bootcamps/hacker-protocol/modules/emblems/Awakening-owl-emblem-phase-1.webp';
import signalEmblem from '../../../assets/images/bootcamps/hacker-protocol/modules/emblems/signal-falcon-emblem-phase-2.webp';
import coreEmblem from '../../../assets/images/bootcamps/hacker-protocol/modules/emblems/core-panther-emblem-phase-3.webp';
import structureEmblem from '../../../assets/images/bootcamps/hacker-protocol/modules/emblems/Structure-bear-emblem-phase-4.webp';
import nexusEmblem from '../../../assets/images/bootcamps/hacker-protocol/modules/emblems/Nexus-Fox-emblem-phase-5.webp';

export const HACKER_PROTOCOL_ID = 'hacker-protocol';

export const HACKER_PROTOCOL_BOOTCAMP = {
  id: HACKER_PROTOCOL_ID,
  title: 'Hacker Protocol',
  subtitle: 'Cycle-Aligned Offensive Security Training Program',
  duration: '6 Weeks',
  format: 'Online + Resources',
  phases: 5,
  emblem: bootcampEmblem,
  badgePalette: {
    base: '#0A0A0A',
    accent: '#991B1B'
  },
  overview:
    'Identity-driven offensive security training built on validation, discipline, and execution. Progression is gated per phase.',
};

export const HACKER_PROTOCOL_PHASES = [
  {
    moduleId: 1,
    codename: 'Awakening',
    roleTitle: 'Analyst',
    title: 'The Hacker Mindset',
    color: '#3A3F8F',
    emblem: awakeningEmblem,
    description:
      'Pattern recognition, adversarial thinking, and cognitive discipline for ethical operations.',
    rooms: [
      {
        roomId: 1,
        title: 'Perception over reaction',
        overview:
          'Learn to frame systems as attack surfaces and map assumptions before touching tools.',
        bullets: [
          'Threat modeling basics',
          'Recon mentality and hypothesis building',
          'Rules of engagement and ethical boundaries'
        ]
      },
      {
        roomId: 2,
        title: 'Learning loops for operators',
        overview:
          'Build a repeatable study-execution-review cycle for long-term offensive growth.',
        bullets: [
          'Feedback loops',
          'Structured notes',
          'Deliberate practice'
        ]
      }
    ],
    ctf: 'Mindset CTF',
    quizPrompt: 'Validate analytical reasoning under constraints.'
  },
  {
    moduleId: 2,
    codename: 'Signal',
    roleTitle: 'Mapper',
    title: 'Computer Networking Foundations',
    color: '#0EA5E9',
    emblem: signalEmblem,
    description:
      'Understand traffic, routing, protocols, and service exposure to map digital terrain precisely.',
    rooms: [
      {
        roomId: 3,
        title: 'Packet and protocol awareness',
        overview: 'Decode network conversations and identify where trust boundaries fail.',
        bullets: ['OSI and TCP/IP layers', 'DNS and HTTP flow', 'Common protocol weaknesses']
      },
      {
        roomId: 4,
        title: 'Subnet and service mapping',
        overview: 'Convert raw scans into actionable system maps.',
        bullets: ['Subnetting', 'Port and service fingerprinting', 'Attack path diagrams']
      },
      {
        roomId: 5,
        title: 'Network attack surfaces',
        overview: 'Model how misconfigurations create real exploit opportunities.',
        bullets: ['Pivot concepts', 'Credential exposure paths', 'Segmentation failures']
      }
    ],
    ctf: 'Network Breach Lab',
    quizPrompt: 'Prove you can map and prioritize targets.'
  },
  {
    moduleId: 3,
    codename: 'Core',
    roleTitle: 'Operator',
    title: 'Linux & Terminal Mastery',
    color: '#22C55E',
    emblem: coreEmblem,
    description:
      'Command-line precision, automation discipline, and environment control for efficient operations.',
    rooms: [
      {
        roomId: 6,
        title: 'Linux foundations',
        overview: 'Navigate systems, users, permissions, and processes with confidence.',
        bullets: ['Filesystem navigation', 'Permissions model', 'Process inspection']
      },
      {
        roomId: 7,
        title: 'Operational shell workflows',
        overview: 'Chain commands into repeatable workflows with clean output.',
        bullets: ['Pipes and redirects', 'grep/sed/awk essentials', 'Automation patterns']
      },
      {
        roomId: 8,
        title: 'Terminal tradecraft',
        overview: 'Use terminal-native tooling to accelerate recon and analysis.',
        bullets: ['Session hygiene', 'tmux basics', 'CLI tool orchestration']
      },
      {
        roomId: 9,
        title: 'System control drills',
        overview: 'Practice direct command authority in realistic challenge flows.',
        bullets: ['Privilege context checks', 'Service triage', 'Log-driven debugging']
      }
    ],
    ctf: 'Linux Survival CTF',
    quizPrompt: 'Demonstrate command authority and control.'
  },
  {
    moduleId: 4,
    codename: 'Structure',
    roleTitle: 'Builder',
    title: 'Web & Backend Systems',
    color: '#B8860B',
    emblem: structureEmblem,
    description:
      'Understand app architecture before exploitation to identify trust and validation failures.',
    rooms: [
      {
        roomId: 10,
        title: 'Web request lifecycle',
        overview: 'Trace client-server interactions and state transitions.',
        bullets: ['HTTP lifecycle', 'Session handling', 'Auth boundaries']
      },
      {
        roomId: 11,
        title: 'Application architecture',
        overview: 'Read layered architectures and identify weak seams.',
        bullets: ['Frontend/backend contracts', 'API boundaries', 'State management risks']
      },
      {
        roomId: 12,
        title: 'Backend data flow',
        overview: 'Track input handling and persistence paths.',
        bullets: ['Validation chains', 'Query safety', 'Error surface control']
      },
      {
        roomId: 13,
        title: 'Service hardening basics',
        overview: 'Map controls that reduce exploitability by design.',
        bullets: ['Secure defaults', 'Rate controls', 'Auditability']
      },
      {
        roomId: 14,
        title: 'Full-stack attack paths',
        overview: 'Connect frontend and backend assumptions into one threat graph.',
        bullets: ['Cross-layer weaknesses', 'Privilege boundaries', 'Exploit chain planning']
      }
    ],
    ctf: 'Web Exploitation Lab',
    quizPrompt: 'Validate architectural understanding and exploit readiness.'
  },
  {
    moduleId: 5,
    codename: 'Nexus',
    roleTitle: 'Strategist',
    title: 'Psychology & Social Engineering',
    color: '#6D28D9',
    emblem: nexusEmblem,
    description:
      'Human attack surfaces, persuasion mechanics, and adaptive strategy for social vectors.',
    rooms: [
      {
        roomId: 15,
        title: 'Behavioral attack surfaces',
        overview: 'Understand cognitive bias and decision-pressure points in human systems.',
        bullets: ['Bias mapping', 'Trust exploitation patterns', 'Context framing']
      },
      {
        roomId: 16,
        title: 'Social engineering foundations',
        overview: 'Build ethical simulation flows and pretext frameworks.',
        bullets: ['Pretext design', 'Scenario scripting', 'Ethical boundaries']
      },
      {
        roomId: 17,
        title: 'Adaptive persuasion drills',
        overview: 'Handle resistance and adjust tactics in real time.',
        bullets: ['Objection handling', 'Signal reading', 'Fallback paths']
      },
      {
        roomId: 18,
        title: 'Simulation debrief protocol',
        overview: 'Convert scenario outcomes into actionable defensive guidance.',
        bullets: ['Debrief templates', 'Control recommendations', 'Validation interviews']
      }
    ],
    ctf: 'Social Breach Simulation',
    quizPrompt: 'Prove strategic influence and ethical control.'
  }
];

export const getHackerProtocolModule = (moduleId) =>
  HACKER_PROTOCOL_PHASES.find((phase) => Number(phase.moduleId) === Number(moduleId));

export const getHackerProtocolRoom = (moduleId, roomId) => {
  const module = getHackerProtocolModule(moduleId);
  if (!module) return null;
  return module.rooms.find((room) => Number(room.roomId) === Number(roomId)) || null;
};

export default {
  bootcamp: HACKER_PROTOCOL_BOOTCAMP,
  phases: HACKER_PROTOCOL_PHASES,
  getHackerProtocolModule,
  getHackerProtocolRoom
};
