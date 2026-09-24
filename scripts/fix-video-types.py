from pathlib import Path
p = Path('/home/ubuntu/caps-workstation/client/src/pages/WorkbenchPage.tsx')
s = p.read_text()
s = s.replace('const visibleClips = clips.filter(clip => `${clip.title} ${clip.category}`.toLowerCase().includes(query.toLowerCase()));', 'const visibleClips = clips.filter(clip => `${clip.title} ${clip.category}`.toLowerCase().includes(query.toLowerCase()));\n  const visibleCatalog = visibleClips.map(({ title, category, duration }) => ({ title, category, duration }));')
s = s.replace('visibleClips.concat(Array.from', 'visibleCatalog.concat(Array.from')
p.write_text(s)
