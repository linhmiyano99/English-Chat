interface ControlsProps {
    topic: string | null;
    onTopicChange: (topic: string | null) => void;
    focusVocab: string[];
    onFocusVocabChange: (vocab: string[]) => void;
  }
  
  export default function Controls({
    topic,
    onTopicChange,
    focusVocab,
    onFocusVocabChange,
  }: ControlsProps) {
    return (
      <div style={{ marginBottom: 12 }}>
        <label>
          Topic:{" "}
          <select
            value={topic ?? ""}
            onChange={(e) =>
              onTopicChange(e.target.value || null)
            }
          >
            <option value="">Free conversation</option>
            <option value="daily_life">Daily life</option>
            <option value="work">Work</option>
            <option value="travel">Travel</option>
          </select>
        </label>
      </div>
    );
  }
  