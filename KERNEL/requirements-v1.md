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


# Milestone 2

## Feature

The spider graph should be interactive so that you can move a dot up or down along each axis.
- this will automatically select that axis
- the selected axis should be both bold and underlined

## Domain Modelling

The app is effectively a list of Ladders, so refactor to reflect that in "models/"

Additionally each Ladder is driven by a JSON file, this makes it simplest to add/modify content.

Therefore ensure each Ladder can drive the Views by having a structure that supports
- Series of Titles or Levels (e.g. 1 through 6 , or Junior through Principal)
- Axis of Growth (Execution, Collaboration, etc.)
- - Text for the levels along each axis



## Polish

### Wording

The top phrase should be simplified from 
"Explore broad capability progressions from the example career graphic. These stages are illustrative across roles. Select an axis, then change its level to compare expectations."
to "Interactively explore your progression and growth."

Remove the extraneous "SELECTED CAPABILITY" and the extraneous "Example level" labels.

The button at the bottom should change title from "RESET EXAMPLE" to "Reset to Default"

Inside the spider graph region, the instruction should be changed and simplified from
"Center: Stage 1 · Outer edge: Stage 5. Select an axis to inspect it." to "Slide to adjust"
to
"Click to adjust a point along any axis" (in italics)

### Summary
The summary interactive text is a great idea.

Modify it to be two parts, 
Strengths: comma separated list of the axis with the highest values
Lowest: comma seaprated list of the axis with the lowest values

### Capability table

The section will have two parts, I like the first part that highlights the exact value selected for each and provides some text

The second part should be the full expandable table like the Software Engineer style Capability Table
- If necessary use empty or placeholder values when data is missing

At the top 

## References by View

The Software Engineer View should be

- https://www.levels.fyi/blog/what-are-career-levels-ladders.html
- https://se-radio.net/2022/06/episode-515-swizec-teller-on-becoming-a-senior-engineer/
- https://newsletter.pragmaticengineer.com/p/what-is-a-principal-engineer-at-amazon
- https://www.youtube.com/watch?v=bOG5GTM_yXs (Getting to Staff Eng)

The General View should have the following references:

- https://dropbox.github.io/dbx-career-framework/
- https://www.frontendhappyhour.com/episodes/engineering-levels-our-glass-level-is-full
- https://sfelc.com/podcasts/building-autonomous-teams-and-engineering-career-ladders-sri-viswanath
- https://www.frontendhappyhour.com/episodes/how-promotions-really-work-in-tech


The EM View should have:

- https://github.com/sourcegraph/handbook/blob/main/content/benefits-pay-perks/pay-expenses/compensation/leveling-guide.md
- https://www.developing.dev/p/frontline-manager-at-meta-to-senior
- https://www.effectiveem.com/building-managers-leading-from-the-back-leading-from-the-front/
- https://sfelc.com/podcasts/conscious-career-growth-part-2
- https://ericbrooke.blog/2018/09/16/software-engineering-leadership/


### Footer

The footer should, below the page separator, instead of "Engineering career development reference"
be
"Built by John Pfeiffer" (with LinkedIn and Github logos/links)

(here's the component you can just copy in https://github.com/johnpfeiffer/converter/blob/main/app/src/components/Footer.tsx)

