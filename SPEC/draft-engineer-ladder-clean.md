# Engineering Ladder — cleaned working copy

Derived from `KERNEL/draft-engineer-ladder.md`. The KERNEL file remains unchanged. This copy repairs obvious word breaks, spelling, and table splits while keeping the draft's meaning. A dash means the draft did not provide a clear expectation for that level. Text in the parking lot is not treated as an active level expectation.

## Guide

The performance characteristics described can be useful in conversations with your manager around quarterly goal setting. The document is not meant to be used as a checklist for promotion. Evaluate levels and their performance characteristics holistically.

The path runs from learning to reactive to engaged to proactive.

## Advanced engineer patterns

- **Longevity and diversity:** Pick projects with a short time to production feedback. Structure existing projects to reduce time to feedback. Once you have learned your lessons, move on to a contrasting project.
- **Success and failure:** Cut your losses, but learn your lessons. Focus on what you could have done differently.
- **Mentored and self-directed:** Build and maintain relationships with engineers you admire. Trust your curiosity as a compass pointing to future growth.
- **Urgency and slack:** Work hard on your main responsibility, but take time to learn when that is the best use of marginal effort.

## Core competencies

### Execution

| Competency | Engineer I | Engineer II | Mid Level | Senior Engineer I |
| --- | --- | --- | --- | --- |
| Scope of Influence | Learning | Individual | Individual | Individual / Team |
| Characteristics | Learn the craft and profession. | Execute with small scope. | Implement at the project level. | Identify project issues; have feature-level impact; deliver consistently. |
| Coding | Write code with assistance. | Write code at a feature level. | Provide proper test coverage. | Refactor code before a change; understand how changes affect other parts of the system; write modular code with proper tests and descriptive logs. |
| Bugs | Fix bugs identified by others. | Identify bugs within a service and help resolve production issues. | Fix feature bugs and resolve production issues independently. | Identify and assist with complex bugs, including infrastructure, timing, and race conditions. |
| Collaboration | Listen and seek to understand; participate at a comfortable level. | Engage with product managers and stakeholders to understand features. | Work with the team until a feature is understood well enough to deliver; participate in Storytime. | Collaborate proactively with product managers and senior engineers on architectural opportunities, decisions, and cross-team questions. |
| Planning | Seek to understand team goals and milestones. | Contribute to goals and milestones. | Develop milestones and communicate status to meet delivery goals. | Develop milestones and communicate status; consider how updates affect others, estimate accurately, and communicate changes proactively. |
| Dependencies | Seek to understand relationships between features and services. | Understand relationships between features and services. | Clarify relationships between features and services. | Proactively improve the team's understanding of relationships between features and services. |
| Priorities | Learn company and team priorities. | Ask clarifying questions of teammates and your manager; keep individual work aligned with team priorities. | Balance competing individual priorities across milestones for consistent on-time delivery. | Adapt to shifting priorities, identify conflicts, and influence team priorities, especially engineering priorities. |
| Estimates | Observe how others discuss and estimate work. | Estimate individual work. | Refine and accurately estimate feature work. | Identify and discuss estimates for individual or team work that appear off. |
| Processes | Learn and follow team and company practices. | Learn other teams' practices. | Balance execution and process. | Understand how other disciplines' processes, including design and regulatory work, affect engineering. |
| Architecture | Listen to team and wider architecture discussions. | Understand architecture diagrams, proposals, and technologies. | Contribute to team architecture discussions. | Contribute to wider architecture discussions and offer useful feedback on team proposals. |

### Engineering Best Practices

| Competency | Engineer I | Engineer II | Mid Level | Senior Engineer I |
| --- | --- | --- | --- | --- |
| Scope of Influence | Learning | Individual | Individual | Team |
| Characteristics | Learn the craft and profession. | Apply practices when directed. | Learn team best practices; affect feature-level code quality. | Understand the team's core technologies deeply; have project-level impact and awareness of architecture and systems practices. |
| Coding | Follow team-wide coding practices. | Include testing and infrastructure practices. | Encourage good practices in colleagues, including through pull request reviews. | Identify improvements to practices and processes, then communicate proposals to the team. |
| Testing | Pair program to write code with tests. | Write unit tests. | Design pull requests for testability, including integration tests. | Raise testability questions during planning. |
| Architecture | Read team architecture proposals. | Build systems according to approved architecture. | Ship features that meet architecture, operations, security, testing, and regulatory criteria. | Present a proposal to architecture review as a step toward regular wider engagement. |
| Technical Debt | Learn about technical debt. | Understand debt in the team's services. | Document new debt when it is discovered or created. | Identify architectural debt and implement some planned debt reduction. |
| Frameworks | Learn the technology frameworks used, such as AWS. | Learn how the team uses those frameworks in depth. | Learn new practices and technologies, and share, document, or apply that learning. | Implement frameworks that improve testability, maintainability, and operational maturity. |
| AI / LLM | Learn the organization's tools and foundational concepts such as prompting and hallucination. | Use the defaults of AI and LLM tools, including code autocomplete, code analysis and explanation, and chat for prompting practice. | Integrate LLMs into your workflow beyond code; use them to understand requirements, engineering, product and privacy practices, and domain concepts; recognize and mitigate shortcomings. | Use LLMs for pair programming, code review, refactoring, architecture documentation, and training less experienced team members. |

### Customer Focus

| Competency | Engineer I | Engineer II | Mid Level | Senior Engineer I |
| --- | --- | --- | --- | --- |
| Scope of Influence | Learning | Individual | Individual | Team |
| Characteristics | Learn the craft and profession. | — | Feature-level impact. | Project-level impact, consistency, and more responsibility. |
| Customer Problems | — | — | Ship code that solves customer problems at feature level. | Take initiative to ship code that solves more complex customer problems at feature level. |
| Customer Value | — | — | Understand the connection between code and customer value; ask why a feature matters. | — |
| Feedback and Analytics | — | — | Incorporate customer feedback and analytics into feature deliverables. | — |
| On Call | Triage items and communicate with the owner. | — | Participate in the rotation, prioritize items, complete assigned tasks, hand off faithfully, and communicate status. | Own on-call work, suggest improvements, triage without intervention, and communicate delays or issues proactively. |
| Stakeholder Needs | — | — | Participate in discussions of customer needs, observe service or business channels, and learn to respond to production stakeholder needs. | — |

The source's Customer Focus table omits the Engineer II column for several rows. Those cells remain blank rather than assigning text to a level without support.

### Leadership

| Competency | Engineer I | Engineer II | Mid Level | Senior Engineer I |
| --- | --- | --- | --- | --- |
| Scope of Influence | Learning | Individual | Individual | Team |
| Characteristics | Learn the craft and profession. | — | Feature-level impact. | Project-level impact, consistency, and more responsibility. |
| Accountability | Understand what your role and team are accountable for. | Demonstrate accountability for individual work. | Demonstrate accountability for project results. | Model accountability for individual and team results. |
| Team | Learn team roles, including product, design, and testing. | — | — | — |
| Initiative | Ask good questions. | Notice and document issues. | Suggest fixes. | Suggest options and tradeoffs; encourage cross-team learning. |
| Communication | Read and understand company positioning; listen to the team's tone and language. | Review team communications. | Lead conversations in public team channels; consider morale and word choice. | Share team updates; stay calm under stress and communicate proactively and positively. |
| Blockers | — | — | — | Help resolve blockers between team members. |
| Research and Tradeoffs | — | — | Research a feature or area to inform the team. | Lead technical analysis of feature-level tradeoffs and costs. |
| Technical Expertise | — | — | — | Show subject matter expertise at feature level. |
| Ownership | — | — | — | Own code and features from concept to production. |
| Technical Choices | — | — | — | Influence positive incremental change by example. |

Further Leadership fragments describe resolving blockers across disciplines, leading complex feature tradeoffs, helping others with expertise, service ownership, and leading technology choices. The source's shifted columns do not clearly assign those fragments to one of the four active levels, so they are kept as draft notes rather than placed in cells.

### Vision and Strategy

| Competency | Engineer I | Engineer II | Mid Level | Senior Engineer I |
| --- | --- | --- | --- | --- |
| Scope of Influence | Learning | Individual | Individual | Individual |
| Characteristics | Learn the craft and profession. | Execute with small scope. | Work at feature level. | Have project-level impact, consistency, and more responsibility. |
| Team Vision | Seek to understand team vision and strategies. | Follow team strategies and learn the department's direction. | Complete designs for a feature area. | Identify gaps in team strategies. |
| Technical Feasibility | — | — | Run technical feasibility spikes at feature level. | — |
| Shared Solutions | — | — | Diagnose common technical or process gaps and create shared solutions. | — |

## Backlog and parking lot

The draft includes further working notes for Senior Engineer II, Staff Engineer, Principal Engineer I, and Senior Principal Engineer. Their row and column boundaries are unclear, so the following notes are not assigned to active level expectations.

- **Scope and characteristics:** The draft names team scope for Senior Engineer II and Staff Engineer, multi-team scope for Principal Engineer I, and company or industry scope for Senior Principal Engineer. It mentions product-level implementation, product-group implementation, technical leadership, and company or industry impact.
- **Dependencies and priorities:** Identify blockers in individual feature work. Balance priorities across people, teams, products, and milestones; communicate the effect of prioritization decisions; negotiate conflicts; deliver reliably despite shifting priorities.
- **Estimation and planning:** Lead estimates for complex team work, assist other engineers with estimates, scope work across quarters, and contribute to a strategic company roadmap.
- **Delivery processes:** Improve product delivery velocity through effective sprint and quarter practices. Balance speed and quality, and use tool and process innovation to improve delivery across the company.
- **Architecture:** Learn new technical specialties, identify architectural opportunities for newer patterns, and architect or improve large-scale systems aligned with strategic engineering initiatives.
- **Quality and efficiency:** Design performance and quality metrics, measure team efficiency and product quality, and use the results to guide improvements.
- **Tradeoffs and risks:** Identify solution risks and tradeoffs, advocate for balanced choices, make technical compromises when needed, and anticipate risks across disciplines and products.
- **Ownership and agency:** Be self-directed, learn unfamiliar technology, own outcomes beyond the initial task, communicate clearly, and favor impact.
