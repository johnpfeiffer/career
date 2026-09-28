# MVP Goal

Career Development App

## MVP Feature Spider Graph

The graphic illustrates an example career development tool:

- a "spider graph" where axis represent domains/direction/capability
- and along each axis there is a progression from beginner (center) to advanced


## Examples

Classic levels are junior, mid level, senior, (sometimes senior II), staff, principal

- <https://dropbox.github.io/dbx-career-framework/swe-_appendix.html>
- <https://dropbox.github.io/dbx-career-framework/ic4_software_engineer.html>
- <https://dropbox.github.io/dbx-career-framework/ic5_staff_software_engineer.html>

My blog post on the subject: https://blog.john-pfeiffer.com/career-development-and-software-engineering-roles/ also has categories and SE1 through SE5

"General" has six radial progressions:

| Capability | 1 (center) | 2 | 3 | 4 | 5 (outer edge) |
| --- | --- | --- | --- | --- | --- |
| Autonomy | Follows | Collaborates | Self-Directed | Empowered | Visionary |
| Execution | Contributes | Performs | Owns | Improves | Revolutionizes |
| Craft | Foundational | Proficient | Advanced | Expert | Pioneers |
| Scope of Influence | Self | Team | Multi-team | Company | Industry |
| People | Learns | Supports | Mentors | Coordinates | Manages |
| Impact | Considers | Comprehends | Organizes | Proactive | Strategizes |

The app's General view adds short explanatory sentences to these labels.


## Details

Possible Categories:

Execution
Engineering Best Practices
Customer Focus
Leadership
Strategy and Vision

## Architecture

React Typescript App:

Put the data (JSON) in app/src/data/

For now the landing page should have a title, lead with the interactive spider graph

Below it should be a summary, then a table 

(use the materials from the online and source ladders .md to populate the JSON which power the graph and table)



