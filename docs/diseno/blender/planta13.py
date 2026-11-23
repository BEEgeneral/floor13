"""Planta 13 · render de prueba con Blender (bpy). Uso: python planta13.py salida.png [muestras]"""
import bpy, bmesh, math, random, sys
from mathutils import Vector
out = sys.argv[1] if len(sys.argv) > 1 else 'planta13.png'; SAMPLES = int(sys.argv[2]) if len(sys.argv) > 2 else 48
random.seed(13)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def mat(name, color, rough=.5, metal=0, emit=None, strength=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
def checker_mat():
    m = bpy.data.materials.new('marmol'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    c = n.new('ShaderNodeTexChecker'); c.inputs['Scale'].default_value = 20; c.inputs['Color1'].default_value = (.62, .56, .44, 1); c.inputs['Color2'].default_value = (.012, .009, .007, 1)
    t = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); l.new(t.outputs['UV'], mp.inputs['Vector']); l.new(mp.outputs['Vector'], c.inputs['Vector'])
    ns = n.new('ShaderNodeTexNoise'); ns.inputs['Scale'].default_value = 6; ns.inputs['Detail'].default_value = 8; l.new(t.outputs['UV'], ns.inputs['Vector'])
    ramp = n.new('ShaderNodeMapRange'); ramp.inputs['To Min'].default_value = .08; ramp.inputs['To Max'].default_value = .3; l.new(ns.outputs['Fac'], ramp.inputs['Value'])
    l.new(c.outputs['Color'], b.inputs['Base Color']); l.new(ramp.outputs['Result'], b.inputs['Roughness']); b.inputs['Coat Weight'].default_value = .4
    return m
M = dict(marble=checker_mat(), brass=mat('latón', (.78, .55, .2), .28, 1), wood=mat('madera', (.07, .035, .02), .4), velvet=mat('terciopelo', (.28, .02, .06), .95),
         felt=mat('tapete', (.02, .22, .26), .95, 0, (.03, .35, .42), .25), rug=mat('alfombra', (.2, .015, .04), .98), card=mat('naipe', (.85, .82, .74), .6), ivory=mat('marfil', (.8, .75, .62), .35),
         skin=mat('piel', (.7, .45, .32), .55), coat=mat('chaqueta', (.4, .03, .09), .6), coat2=mat('chaqueta2', (.04, .26, .32), .6), black=mat('negro', (.01, .01, .012), .35),
         flame=mat('llama', (1, .6, .2), 1, 0, (1, .55, .15), 40), cyan=mat('cian', (.2, .6, .7), 1, 0, (.3, .9, 1), 4), wall=mat('pared', (.05, .028, .018), .5), gold=mat('oro', (.9, .65, .2), .2, 1))
def obj(o, m, loc=None, rot=None):
    o = bpy.context.active_object; o.data.materials.append(M[m]) if isinstance(m, str) else None
    if loc: o.location = loc
    if rot: o.rotation_euler = rot
    return o
def box(sx, sy, sz, m, loc): bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object; o.scale = (sx, sy, sz); o.location = loc; o.data.materials.append(M[m]); return o
def cyl(r, h, m, loc, v=48): bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=v); o = bpy.context.active_object; o.location = loc; o.data.materials.append(M[m]); bpy.ops.object.shade_smooth(); return o
def sph(r, m, loc): bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=32, ring_count=16); o = bpy.context.active_object; o.location = loc; o.data.materials.append(M[m]); bpy.ops.object.shade_smooth(); return o
def torus(R, r, m, loc, rot=(0, 0, 0)): bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=64, minor_segments=16); o = bpy.context.active_object; o.location = loc; o.rotation_euler = rot; o.data.materials.append(M[m]); bpy.ops.object.shade_smooth(); return o

# sala
bpy.ops.mesh.primitive_plane_add(size=1); f = bpy.context.active_object; f.scale = (20, 13, 1); f.data.materials.append(M['marble'])
box(20, .3, 6, 'wall', (0, 6.5, 3)); box(.3, 13, 6, 'wall', (-10, 0, 3)); box(.3, 13, 6, 'wall', (10, 0, 3)); box(20, .3, .35, 'brass', (0, 6.3, 5.8))
for x in range(-9, 10, 2):  # paneles en relieve
    box(1.5, .06, 2.6, 'wood', (x, 6.33, 3.2)); box(1.6, .05, .08, 'brass', (x, 6.3, 4.5)); box(1.6, .05, .08, 'brass', (x, 6.3, 1.9))
box(20, .32, .2, 'brass', (0, 6.3, 1.4))
bpy.ops.mesh.primitive_plane_add(size=1); r = bpy.context.active_object; r.scale = (9.6, 6, 1); r.location = (0, -1.6, .01); r.data.materials.append(M['rug'])
box(9.8, .04, .12, 'gold', (0, -4.6, .02)); box(9.8, .04, .12, 'gold', (0, 1.4, .02)); box(.12, .04, 6.2, 'gold', (-4.9, -1.6, .02)); box(.12, .04, 6.2, 'gold', (4.9, -1.6, .02))
for x in (-4.8, 4.8, -9.2, 9.2):  # columnas
    cyl(.38, 4.7, 'ivory', (x, 5.8, 2.6), 24); box(1, 1, .25, 'ivory', (x, 5.8, .13)); box(1, 1, .25, 'ivory', (x, 5.8, 5.0)); box(1.1, 1.1, .12, 'brass', (x, 5.8, 5.2))
# ascensor: marco en arco (medio toro) + puertas
bpy.ops.mesh.primitive_torus_add(major_radius=1.95, minor_radius=.2, major_segments=64, minor_segments=16); a = bpy.context.active_object
bm = bmesh.new(); bm.from_mesh(a.data); bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.y < -.01], context='VERTS'); bm.to_mesh(a.data); bm.free()
a.rotation_euler = (math.pi/2, 0, 0); a.location = (0, 6.2, 2.9); a.data.materials.append(M['brass'])
box(.4, .4, 2.9, 'brass', (-1.95, 6.2, 1.45)); box(.4, .4, 2.9, 'brass', (1.95, 6.2, 1.45))
box(3.5, .1, 2.8, 'cyan', (0, 6.35, 1.4)); sph(1.75, 'cyan', (0, 6.4, 2.9)).scale = (1, .05, 1)
for i in range(-4, 5): box(.05, .06, 3.6, 'gold', (i*.4, 6.05, 1.8)).rotation_euler = (0, math.radians(32 if i % 2 else -32), 0)
cyl(.4, .1, 'black', (0, 6.0, 5.1)).rotation_euler = (math.pi/2, 0, 0); torus(.42, .05, 'brass', (0, 5.97, 5.1), (math.pi/2, 0, 0))
# bobinas y arcos
for sx in (-1, 1):
    x = sx*3.4; box(.9, .9, .25, 'brass', (x, 5.2, .13)); cyl(.15, 2.8, 'brass', (x, 5.2, 1.6), 16)
    for i in range(5): torus(.3, .04, 'brass', (x, 5.2, .8 + i*.38))
    torus(.65, .24, 'brass', (x, 5.2, 3.2))
    pts = [Vector((x, 5.2, 3.45))]; end = Vector((sx*.5, 6.0, 5.0))
    for k in range(1, 9): t = k/9; pts.append(pts[0].lerp(end, t) + Vector((random.uniform(-.25, .25), random.uniform(-.1, .1), random.uniform(-.25, .25))))
    pts.append(end); cu = bpy.data.curves.new('arco', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('POLY'); sp.points.add(len(pts)-1)
    for p, v in zip(sp.points, pts): p.co = (*v, 1)
    cu.bevel_depth = .025; co = bpy.data.objects.new('arco', cu); co.data.materials.append(M['cyan']); sc.collection.objects.link(co)
# mesa de examen
cyl(.4, .8, 'wood', (0, -1.6, .4), 24); cyl(2.2, .2, 'wood', (0, -1.6, .9)); torus(2.2, .07, 'brass', (0, -1.6, 1.0)); cyl(1.96, .05, 'felt', (0, -1.6, 1.02))
for i in range(5):
    c = box(.36, .52, .012, 'card', (-.5 + i*.25, -1.9, 1.06)); c.rotation_euler = (0, 0, math.radians(-24 + i*12)); box(.14, .2, .014, 'velvet', (-.5 + i*.25, -1.9, 1.066)).rotation_euler = (0, 0, math.radians(-24 + i*12))
box(.4, .26, .06, 'gold', (1.1, -1.5, 1.07))
# cámara cenital
cyl(.05, 2.4, 'brass', (0, -1.6, 4.2), 12); cyl(.42, .3, 'brass', (0, -1.6, 3.0)); cyl(.28, .06, 'cyan', (0, -1.6, 2.83), 32)
# sillas y personas
def chair(x, y, rot):
    box(.8, .8, .12, 'velvet', (x, y, .5)).rotation_euler = (0, 0, rot); b = box(.8, .12, 1.0, 'velvet', (x, y, 1.0)); b.location = (x - math.sin(rot)*.34*-1, y - math.cos(rot)*.34, 1.0); b.rotation_euler = (0, 0, rot)
    for dx in (-.34, .34):
        for dy in (-.34, .34): cyl(.04, .4, 'brass', (x + dx, y + dy, .2), 8)
def person(x, y, jacket, hat=True, rot=0, seated=False):
    z = .62 if seated else .8
    if not seated: box(.2, .2, .8, 'black', (x - .13, y, .4)); box(.2, .2, .8, 'black', (x + .13, y, .4))
    else: box(.45, .55, .2, 'black', (x, y - .1, .62))
    cyl(.27, 1.0, jacket, (x, y, z + .5), 24); sph(.2, 'skin', (x, y, z + 1.2)); box(.1, .02, .42, 'card', (x, y - .26, z + .6))
    if hat: cyl(.32, .03, 'black', (x, y, z + 1.34), 32); cyl(.21, .34, 'black', (x, y, z + 1.52), 32); cyl(.215, .06, 'velvet', (x, y, z + 1.4), 32)
for x in (-7.4, -6.5, -5.6): chair(x, 3.5, math.pi); person(x, 3.45, ['coat', 'coat2', 'coat'][int((x+7.4)/.9)], hat=(x != -6.5), seated=True)
box(3.2, .9, .8, 'wood', (-6.5, 2.4, .4)); box(3.3, 1.0, .08, 'brass', (-6.5, 2.4, .82))
for r in range(3):
    for c in range(4): chair(5.8 + c*1.15, -.6 - r*1.5, math.pi/2)
person(6.9, -.6, 'coat2', False, seated=True); person(8.05, -2.1, 'coat', seated=True)
person(0, -.2, 'coat'); person(0.4, -4.6, 'coat2')
# candelabros con llama
LIGHTS = []
for (x, y) in ((-9, 5.4), (9, 5.4), (-9, -5.6), (9, -5.6)):
    cyl(.07, 1.4, 'brass', (x, y, .7), 12); cyl(.26, .08, 'brass', (x, y, .04), 20); torus(.4, .025, 'brass', (x, y, 1.45), (math.pi/2, 0, 0))
    for dx in (-.4, 0, .4): cyl(.035, .36, 'ivory', (x + dx, y, 1.62), 8); sph(.055, 'flame', (x + dx, y, 1.9)).scale = (1, 1, 1.9)
    bpy.ops.object.light_add(type='POINT', location=(x, y - (.3 if y > 0 else -.3), 1.9)); l = bpy.context.active_object; l.data.color = (1, .62, .3); l.data.energy = 420; l.data.shadow_soft_size = .15; LIGHTS.append(l)
# luces: cian de la cámara y de las bobinas
bpy.ops.object.light_add(type='SPOT', location=(0, -1.6, 2.8)); s = bpy.context.active_object; s.data.color = (.45, .93, 1); s.data.energy = 1400; s.data.spot_size = math.radians(70); s.data.spot_blend = .6; s.data.shadow_soft_size = .1
for x in (-3.4, 3.4): bpy.ops.object.light_add(type='POINT', location=(x, 4.9, 3.5)); l = bpy.context.active_object; l.data.color = (.4, .92, 1); l.data.energy = 600; l.data.shadow_soft_size = .3
bpy.ops.object.light_add(type='AREA', location=(0, -5, 5.5)); l = bpy.context.active_object; l.data.energy = 250; l.data.size = 8; l.data.color = (1, .78, .55); l.rotation_euler = (math.radians(50), 0, 0)
# mundo y cámara
w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .008, .014, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = .5; sc.world = w
bpy.ops.object.camera_add(location=(0, -15.5, 8.4)); cam = bpy.context.active_object; sc.camera = cam; cam.data.lens = 30
cam.rotation_euler = (Vector((0, 1.5, 1.4)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
# render
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6
sc.render.resolution_x = 1280; sc.render.resolution_y = 832; sc.render.filepath = out; sc.render.image_settings.file_format = 'PNG'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
bpy.ops.render.render(write_still=True); print('OK', out)
