
# Instructions

For blackbox UAT 
- Test through the rendered application and browser controls.
- Record each view’s default values from a fresh browser session before changing
- Use KERNEL/requirements and source data as the behavior and content oracle 

# Test Plan

## Happy Paths

- First visit and page presentation
- Select an axis without changing its value
- Adjust a value directly by clicking the graph
- Adjust a dot by dragging
- Build a mixed profile and verify the summary
- Read selected values and expand the full ladder
- Explore every view and every level
- Verify references and creator links

### Complex

- Complete a multi-view session, reload, and reset

## Edge Cases

- Clicks between levels and away from an axis
- Switching between ladders with different level counts
- Values at and beyond the graph boundaries
- - Inspect the selected-level and next-level text.
- Rapid interactions do not edit the wrong capability
- An interrupted drag does not leave interaction stuck
- All capabilities have the same value
- Missing detailed source content does not misrepresent a level

### Weird Cases

- Narrow screens and touch interaction
- Browser storage is unavailable
- Long text and browser zoom

