import { createSegmentedControl, Section, Setting } from "@/components";
import { useSettingsControls } from "@/hooks/useSettings";

type PostSectionProps = {
  children?: null;
};

const PostSection = (_props: PostSectionProps) => {
  const { verticalConstraint, align, liveUpdate } = useSettingsControls();

  return (
    <>
      <Section.Content.Page.Section label="Post">
        <Setting>
          <Setting.Label>Vertical Constraint</Setting.Label>
          <Setting.Description>It's a vertical constraint... r u fr</Setting.Description>
          <Setting.Input>
            {createSegmentedControl(verticalConstraint.value, verticalConstraint.update, [
              { label: "Off", value: "off" },
              { label: "Full", value: "full" },
              { label: "Margined", value: "margined" },
            ])}
          </Setting.Input>
        </Setting>

        <Setting>
          <Setting.Label>Align</Setting.Label>
          <Setting.Description>It's an align... r u fr</Setting.Description>
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
          <Setting.Description>It's a live update... r u fr</Setting.Description>
          <Setting.Input>
            {createSegmentedControl(liveUpdate.value, liveUpdate.update, [
              { label: "Off", value: false },
              { label: "On", value: true },
            ])}
          </Setting.Input>
        </Setting>
      </Section.Content.Page.Section>
    </>
  );
};

export default PostSection;
