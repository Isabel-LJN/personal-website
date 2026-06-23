export default function LocaleLoading() {
  return (
    <div className="page-loading editorial-container" aria-busy="true" aria-label="Loading">
      <div className="page-loading-bar" />
      <div className="page-loading-body">
        <div className="page-loading-line page-loading-line--sm" />
        <div className="page-loading-line page-loading-line--lg" />
        <div className="page-loading-line page-loading-line--md" />
      </div>
    </div>
  );
}
