import { Section, Select, Setting, Slider, Toggle } from "@/components";
import { useSettingsControls } from "@/hooks/useSettings";

type PostSectionProps = {
  children?: null;
};

const PostSection = (_props: PostSectionProps) => {
  const {
    verticalConstraint: {
      type: verticalConstraint,
      margin: verticalConstraintMargin,
      liveUpdate: { enabled: liveUpdate, debounce: liveUpdateDebounce },
    },
    align,
    hideTopAd,
  } = useSettingsControls();

  return (
    <>
      <Section.Content.Page.Section label="Post">
        <Setting>
          <Setting.Label>Vertical Constraint</Setting.Label>
          <Setting.Description>
            Controls how the image fits vertically. Off applies no constraint (native scroll). Full
            constrains the image to viewport height. Margined constrains the image with a gap around
            it.
          </Setting.Description>
          <Setting.Input>
            <Select
              value={verticalConstraint.value}
              onChange={verticalConstraint.update}
              options={[
                { label: "Off", value: "off" },
                { label: "Full", value: "full" },
                { label: "Margined", value: "margined" },
              ]}
            />
          </Setting.Input>
        </Setting>

        {verticalConstraint.value === "margined" && (
          <Setting nested={1}>
            <Setting.Label>Space</Setting.Label>
            <Setting.Description>
              Gap between the image and viewport edges in Margined mode.
            </Setting.Description>
            <Setting.Input>
              <Slider
                value={verticalConstraintMargin.value}
                onChange={verticalConstraintMargin.update}
                min={0}
                max={50}
              />
            </Setting.Input>
          </Setting>
        )}

        {verticalConstraint.value !== "off" && (
          <Setting nested={1}>
            <Setting.Label>Live Update</Setting.Label>
            <Setting.Description>
              Continuously recalculates the constraint during scroll and resize events to keep the
              image positioned correctly.
            </Setting.Description>
            <Setting.Input>
              <Toggle checked={liveUpdate.value} onChange={liveUpdate.update} />
            </Setting.Input>
          </Setting>
        )}

        {liveUpdate.value === true && verticalConstraint.value !== "off" && (
          <Setting nested={2}>
            <Setting.Label>Debounce</Setting.Label>
            <Setting.Description>
              Interval in ms between recalculations. Lower values update more frequently for
              smoother motion but use more CPU.
            </Setting.Description>
            <Setting.Input>
              <Slider
                value={liveUpdateDebounce.value}
                onChange={liveUpdateDebounce.update}
                min={0}
                max={200}
              />
            </Setting.Input>
          </Setting>
        )}

        <Setting>
          <Setting.Label>Align</Setting.Label>
          <Setting.Description>
            Horizontal position of the image relative to the viewport.
          </Setting.Description>
          <Setting.Input>
            <Select
              value={align.value}
              onChange={align.update}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
            />
          </Setting.Input>
        </Setting>

        <Setting>
          <Setting.Label>Hide Top Ad</Setting.Label>
          <Setting.Description>
            Moves the top leaderboard ad to be next to the bottom leaderboard ad.
          </Setting.Description>
          <Setting.Input>
            <Toggle checked={hideTopAd.value} onChange={hideTopAd.update} />
          </Setting.Input>
        </Setting>
      </Section.Content.Page.Section>
    </>
  );
};

export default PostSection;
