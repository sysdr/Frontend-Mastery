import './WidgetPlaceholder.css';

interface WidgetPlaceholderProps {
  title: string;
}

const WidgetPlaceholder = ({ title }: WidgetPlaceholderProps) => {
  return (
    <div className="widget-placeholder">
      <h3>{title}</h3>
      <p>Data goes here...</p>
    </div>
  );
};

export default WidgetPlaceholder;
