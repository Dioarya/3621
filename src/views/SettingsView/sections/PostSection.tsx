import { createSegmentedControl, Section, Setting } from "@/components";
import { useSettingsControls } from "@/hooks/useSettings";

type PostSectionProps = {
  children?: null;
};

const PostSection = (_props: PostSectionProps) => {
  const {
    verticalConstraint: { type: verticalConstraint, margin: verticalConstraintMargin },
    align,
    liveUpdate: { enabled: liveUpdate, debounce: liveUpdateDebounce },
  } = useSettingsControls();

  return (
    <>
      <Section.Content.Page.Section label="Post">
        <Setting>
          <Setting.Label>Vertical Constraint</Setting.Label>
          <Setting.Description>Constrain the image height within the viewport.</Setting.Description>
          <Setting.Input>
            {createSegmentedControl(verticalConstraint.value, verticalConstraint.update, [
              { label: "Off", value: "off" },
              { label: "Full", value: "full" },
              { label: "Margined", value: "margined" },
            ])}
          </Setting.Input>
        </Setting>

        {verticalConstraint.value === "margined" && (
          <Setting nested>
            <Setting.Label>Space</Setting.Label>
            <Setting.Description>
              Space between the image and viewport edges in Margined mode.
            </Setting.Description>
            <Setting.Input>
              {createSegmentedControl(
                verticalConstraintMargin.value,
                verticalConstraintMargin.update,
                [
                  { label: "5px", value: 5 },
                  { label: "10px", value: 10 },
                  { label: "30px", value: 30 },
                ],
              )}
            </Setting.Input>
          </Setting>
        )}

        <Setting>
          <Setting.Label>Align</Setting.Label>
          <Setting.Description>
            Horizontal alignment of the image in the viewport.
          </Setting.Description>
          <Setting.Input>
            {createSegmentedControl(align.value, align.update, [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ])}
          </Setting.Input>
        </Setting>

        <Setting>
          <Setting.Label>Live Update</Setting.Label>
          <Setting.Description>
            Reapply constraints dynamically while scrolling and resizing.
          </Setting.Description>
          <Setting.Input>
            {createSegmentedControl(liveUpdate.value, liveUpdate.update, [
              { label: "Off", value: false },
              { label: "On", value: true },
            ])}
          </Setting.Input>
        </Setting>

        {liveUpdate.value === true && (
          <Setting nested>
            <Setting.Label>Debounce</Setting.Label>
            <Setting.Description>
              How often the constraint recalculates. Higher is smoother but more CPU.
            </Setting.Description>
            <Setting.Input>
              {createSegmentedControl(liveUpdateDebounce.value, liveUpdateDebounce.update, [
                { label: "10fps", value: 1000 / 10 },
                { label: "30fps", value: 1000 / 30 },
                { label: "60fps", value: 1000 / 60 },
              ])}
            </Setting.Input>
          </Setting>
        )}
      </Section.Content.Page.Section>
    </>
  );
};

export default PostSection;
