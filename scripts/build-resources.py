from pathlib import Path
import re

src = Path('/home/ubuntu/upload/pasted_content.txt').read_text()
rows = []
for m in re.finditer(r'^\[(.+?)\]\((https://www\.youtube\.com/results\?[^)]+)\)$', src, re.M):
    title, url = m.groups()
    category = 'Machine Learning'
    low = title.lower()
    for needle, label in [
        ('pathology', 'Pathology AI'), ('wsi', 'Digital Pathology'), ('cell', 'Cell Biology'),
        ('medical', 'Medical Imaging'), ('vision', 'Computer Vision'), ('cnn', 'Computer Vision'),
        ('transformer', 'Transformers'), ('attention', 'Transformers'), ('llm', 'Foundation Models'),
        ('embedding', 'Representation Learning'), ('contrastive', 'Self-Supervised Learning'),
        ('self supervised', 'Self-Supervised Learning'), ('dino', 'Self-Supervised Learning'),
        ('pca', 'Embeddings'), ('umap', 'Embeddings'), ('t-sne', 'Embeddings'),
        ('graph', 'Graph Neural Networks'), ('protein', 'Scientific AI'), ('alphafold', 'Scientific AI'),
        ('gpu', 'GPU Computing'), ('cuda', 'GPU Computing'), ('distributed', 'ML Systems'),
        ('quantization', 'Model Optimization'), ('pruning', 'Model Optimization'),
        ('mlops', 'MLOps'), ('mlflow', 'MLOps'), ('kubeflow', 'MLOps'), ('ray', 'MLOps'),
        ('uncertainty', 'Uncertainty'), ('calibration', 'Uncertainty'), ('interpretability', 'Explainable AI'),
        ('grad-cam', 'Explainable AI'), ('shap', 'Explainable AI'), ('spatial', 'Spatial Biology'),
        ('cancer', 'Cancer AI'), ('tumor', 'Cancer AI'), ('digital twin', 'Digital Twins'),
    ]:
        if needle in low:
            category = label
            break
    tags = [x for x in re.split(r'[^a-z0-9]+', low) if len(x) > 2][:4]
    rows.append((title, url, category, tags))

out = Path('/home/ubuntu/caps-workstation/client/src/lib/resources.ts')
out.parent.mkdir(parents=True, exist_ok=True)
with out.open('w') as f:
    f.write("export type VideoResource = { title: string; url: string; category: string; tags: string[]; source: string; description: string; };\n\n")
    f.write('export const videoResources: VideoResource[] = [\n')
    for title, url, category, tags in rows:
        f.write('  ' + repr({'title': title, 'url': url, 'category': category, 'tags': tags, 'source': 'YouTube search · user-provided resource', 'description': 'Curated technical search resource for the CaPS research observatory.'}).replace("'", '"') + ',\n')
    f.write('];\n')
print(f'generated {len(rows)} resources')

images = [
    ('Whole slide image of Wilms tumor', 'Pathology', 'https://commons.wikimedia.org/wiki/File:Whole_slide_image_of_Wilms%27_tumor.png'),
    ('Whole slide image quality comparison', 'Pathology', 'https://commons.wikimedia.org/wiki/File:Whole_slide_image_quality_comparison.png'),
    ('Whole slide images category', 'Digital Pathology', 'https://commons.wikimedia.org/wiki/Category:Whole_slide_images'),
    ('Pathology public-domain archive', 'Pathology', 'https://commons.wikimedia.org/wiki/Category:The_Armed_Forces_Institute_of_Pathology_Public_Domain_Images'),
    ('Microscopy image collection', 'Microscopy', 'https://commons.wikimedia.org/wiki/Category:Microscopy'),
    ('Machine learning visualizations', 'Machine Learning', 'https://www.google.com/search?tbm=isch&q=machine+learning+AI+visualization'),
    ('Neural network architectures', 'Deep Learning', 'https://www.google.com/search?tbm=isch&q=neural+network+architecture'),
    ('Transformer architectures', 'Transformers', 'https://www.google.com/search?tbm=isch&q=transformer+architecture+AI'),
    ('Computer vision visualizations', 'Computer Vision', 'https://www.google.com/search?tbm=isch&q=computer+vision+AI'),
    ('Embedding space plots', 'Representation Learning', 'https://www.google.com/search?tbm=isch&q=embedding+space+machine+learning'),
    ('UMAP projection atlas', 'Embeddings', 'https://www.google.com/search?tbm=isch&q=UMAP+machine+learning+visualization'),
    ('Feature map anatomy', 'Explainable AI', 'https://www.google.com/search?tbm=isch&q=deep+learning+feature+maps'),
    ('CNN feature maps', 'Computer Vision', 'https://www.google.com/search?tbm=isch&q=CNN+feature+maps'),
    ('AI heatmaps', 'Explainable AI', 'https://www.google.com/search?tbm=isch&q=AI+heatmap+machine+learning'),
    ('Digital pathology atlas', 'Digital Pathology', 'https://www.google.com/search?tbm=isch&q=digital+pathology+whole+slide+image'),
    ('Histopathology microscopy', 'Pathology', 'https://www.google.com/search?tbm=isch&q=histopathology+microscopy'),
    ('Cancer pathology atlas', 'Cancer AI', 'https://www.google.com/search?tbm=isch&q=cancer+histopathology+microscopy'),
    ('WSI analysis reference', 'Digital Pathology', 'https://www.google.com/search?tbm=isch&q=whole+slide+imaging+pathology'),
    ('Spatial transcriptomics', 'Spatial Biology', 'https://www.google.com/search?tbm=isch&q=spatial+transcriptomics+visualization'),
    ('Graph neural networks', 'Graph Neural Networks', 'https://www.google.com/search?tbm=isch&q=graph+neural+network+visualization'),
]
with Path('/home/ubuntu/caps-workstation/client/src/lib/images.ts').open('w') as f:
    f.write('export type ImageResource = { title: string; category: string; source: string; href: string; accent: string; };\n\n')
    f.write('export const imageResources: ImageResource[] = [\n')
    accents = ['#f59e0b', '#22d3ee', '#a78bfa', '#fb7185', '#34d399']
    for i, (title, category, href) in enumerate(images):
        f.write(f'  {title!r}'.replace("'", '"') + f',\n')
    # rewrite proper objects separately
    f.seek(0); f.truncate()
    f.write('export type ImageResource = { title: string; category: string; source: string; href: string; accent: string; };\n\n')
    f.write('export const imageResources: ImageResource[] = [\n')
    for i, (title, category, href) in enumerate(images):
        f.write(f'  {{ title: {title!r}, category: {category!r}, source: "Wikimedia Commons / public search", href: {href!r}, accent: {accents[i % len(accents)]!r} }},\n'.replace("'", '"'))
    f.write('];\n')
print('generated 20 image references')
