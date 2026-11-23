"""Librería común del hotel Floor 13 (Blender / bpy). Materiales, primitivas, piezas y luces compartidas por todas las estancias."""
import bpy, bmesh, math, random
from mathutils import Vector

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True); random.seed(13); LIGHTS.clear(); return bpy.context.scene
LIGHTS = []

def mat(name, color, rough=.5, metal=0, emit=None, strength=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
def checker_mat(scale=20):
    m = bpy.data.materials.new('marmol'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    c = n.new('ShaderNodeTexChecker'); c.inputs['Scale'].default_value = scale; c.inputs['Color1'].default_value = (.5, .45, .35, 1); c.inputs['Color2'].default_value = (.012, .009, .007, 1)
    t = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); l.new(t.outputs['UV'], mp.inputs['Vector']); l.new(mp.outputs['Vector'], c.inputs['Vector'])
    ns = n.new('ShaderNodeTexNoise'); ns.inputs['Scale'].default_value = 6; ns.inputs['Detail'].default_value = 8; l.new(t.outputs['UV'], ns.inputs['Vector'])
    ramp = n.new('ShaderNodeMapRange'); ramp.inputs['To Min'].default_value = .08; ramp.inputs['To Max'].default_value = .3; l.new(ns.outputs['Fac'], ramp.inputs['Value'])
    l.new(c.outputs['Color'], b.inputs['Base Color']); l.new(ramp.outputs['Result'], b.inputs['Roughness']); b.inputs['Coat Weight'].default_value = .4
    return m
def parquet_mat(scale=14):
    m = bpy.data.materials.new('parquet'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    t = n.new('ShaderNodeTexCoord'); br = n.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value = scale; br.inputs['Color1'].default_value = (.13, .06, .03, 1); br.inputs['Color2'].default_value = (.08, .035, .018, 1); br.inputs['Mortar'].default_value = (.02, .01, .006, 1); br.inputs['Mortar Size'].default_value = .01; br.inputs['Brick Width'].default_value = .5; br.inputs['Row Height'].default_value = .25
    l.new(t.outputs['UV'], br.inputs['Vector']); l.new(br.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .28; b.inputs['Coat Weight'].default_value = .5
    return m
def build_mats():
    M.clear(); M.update(marble=checker_mat(), parquet=parquet_mat(), brass=mat('latón', (.78, .55, .2), .28, 1), wood=mat('madera', (.07, .035, .02), .4), velvet=mat('terciopelo', (.28, .02, .06), .95),
        felt=mat('tapete', (.02, .22, .26), .95, 0, (.03, .35, .42), .25), green=mat('tapeteverde', (.02, .2, .1), .95), rug=mat('alfombra', (.2, .015, .04), .98), card=mat('naipe', (.85, .82, .74), .6), ivory=mat('marfil', (.8, .75, .62), .35),
        skin=mat('piel', (.7, .45, .32), .55), coat=mat('chaqueta', (.4, .03, .09), .6), coat2=mat('chaqueta2', (.04, .26, .32), .6), black=mat('negro', (.01, .01, .012), .35),
        flame=mat('llama', (1, .6, .2), 1, 0, (1, .55, .15), 40), cyan=mat('cian', (.2, .6, .7), 1, 0, (.3, .9, 1), 4), wall=mat('pared', (.05, .028, .018), .5), gold=mat('oro', (.9, .65, .2), .2, 1),
        lamp=mat('lampara', (1, .8, .5), 1, 0, (1, .65, .3), 12), night=mat('noche', (.05, .1, .25), 1, 0, (.2, .35, .8), 3), leaf=mat('hoja', (.03, .16, .06), .7), pot=mat('maceta', (.2, .1, .06), .6),
        paper=mat('papel', (.8, .75, .6), .8, 0, (.9, .8, .55), .6), glass=mat('cristal', (.2, .3, .25), .1, 0))
M = {}

def box(sx, sy, sz, m, loc, rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object; o.scale = (sx, sy, sz); o.location = loc; o.data.materials.append(M[m])
    if rot: o.rotation_euler = rot
    return o
def cyl(r, h, m, loc, v=48, rot=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=v); o = bpy.context.active_object; o.location = loc; o.data.materials.append(M[m]); bpy.ops.object.shade_smooth()
    if rot: o.rotation_euler = rot
    return o
def sph(r, m, loc, scale=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=32, ring_count=16); o = bpy.context.active_object; o.location = loc; o.data.materials.append(M[m]); bpy.ops.object.shade_smooth()
    if scale: o.scale = scale
    return o
def torus(R, r, m, loc, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=64, minor_segments=16); o = bpy.context.active_object; o.location = loc; o.rotation_euler = rot; o.data.materials.append(M[m]); bpy.ops.object.shade_smooth(); return o
def plane(sx, sy, m, loc, rot=None):
    bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.active_object; o.scale = (sx, sy, 1); o.location = loc; o.data.materials.append(M[m])
    if rot: o.rotation_euler = rot
    return o
def light(kind, loc, color, energy, size=.15, rot=None, spot=None):
    bpy.ops.object.light_add(type=kind, location=loc); l = bpy.context.active_object; l.data.color = color; l.data.energy = energy
    if kind == 'AREA': l.data.size = size
    else: l.data.shadow_soft_size = size
    if rot: l.rotation_euler = rot
    if spot: l.data.spot_size = math.radians(spot); l.data.spot_blend = .6
    return l

# ---------- cáscara de la sala ----------
def shell(W, D, H=6, floor='marble', panels=True):
    """Sala de ancho W (x), fondo D (y); pared del fondo en y=+D/2. Origen en el centro del suelo."""
    f = plane(W, D, floor, (0, 0, 0)); 
    box(W, .3, H, 'wall', (0, D/2, H/2)); box(.3, D, H, 'wall', (-W/2, 0, H/2)); box(.3, D, H, 'wall', (W/2, 0, H/2)); box(W, .32, .35, 'brass', (0, D/2-.2, H-.2))
    if panels:
        for x in range(int(-W/2)+1, int(W/2), 2):
            box(1.5, .06, 2.6, 'wood', (x, D/2-.17, 3.2)); box(1.6, .05, .08, 'brass', (x, D/2-.2, 4.5)); box(1.6, .05, .08, 'brass', (x, D/2-.2, 1.9))
        box(W, .34, .2, 'brass', (0, D/2-.2, 1.4))
def column(x, y, h=4.7):
    cyl(.38, h, 'ivory', (x, y, h/2+.15), 24); box(1, 1, .25, 'ivory', (x, y, .13)); box(1, 1, .25, 'ivory', (x, y, h+.3)); box(1.1, 1.1, .12, 'brass', (x, y, h+.5))
def candelabra(x, y, power=420):
    cyl(.07, 1.4, 'brass', (x, y, .7), 12); cyl(.26, .08, 'brass', (x, y, .04), 20); torus(.4, .025, 'brass', (x, y, 1.45), (math.pi/2, 0, 0))
    for dx in (-.4, 0, .4): cyl(.035, .36, 'ivory', (x + dx, y, 1.62), 8); sph(.055, 'flame', (x + dx, y, 1.9), (1, 1, 1.9))
    light('POINT', (x, y - .3 if y > 0 else y + .3, 1.9), (1, .62, .3), power)
def pendant(x, y, z=4.2, power=500):
    cyl(.01, 6-z, 'brass', (x, y, (6+z)/2), 6); sph(.28, 'lamp', (x, y, z), (1, 1, .8)); cyl(.34, .06, 'brass', (x, y, z+.22), 24)
    light('POINT', (x, y, z-.1), (1, .66, .35), power, .2)
def chair(x, y, rot=0):
    c, s = math.cos(rot), math.sin(rot)
    box(.8, .8, .12, 'velvet', (x, y, .5), (0, 0, rot)); box(.8, .12, 1.0, 'velvet', (x - s*.34, y + c*.34 - 0, 1.0), (0, 0, rot))
    for dx in (-.34, .34):
        for dy in (-.34, .34): cyl(.04, .4, 'brass', (x + dx, y + dy, .2), 8)
def person(x, y, jacket='coat', hat=True, seated=False, z0=0):
    z = z0 + (.62 if seated else .8)
    if not seated: box(.2, .2, .8, 'black', (x - .13, y, z0 + .4)); box(.2, .2, .8, 'black', (x + .13, y, z0 + .4))
    else: box(.45, .55, .2, 'black', (x, y - .1, z0 + .62))
    cyl(.27, 1.0, jacket, (x, y, z + .5), 24); sph(.2, 'skin', (x, y, z + 1.2)); box(.1, .02, .42, 'card', (x, y - .26, z + .6))
    if hat: cyl(.32, .03, 'black', (x, y, z + 1.34), 32); cyl(.21, .34, 'black', (x, y, z + 1.52), 32); cyl(.215, .06, 'velvet', (x, y, z + 1.4), 32)
def round_table(x, y, r=1.0, top='wood', cloth=None):
    cyl(.18, .75, 'wood', (x, y, .4), 16); cyl(r, .1, cloth or top, (x, y, .8)); torus(r, .04, 'brass', (x, y, .86))
def sofa(x, y, w=3, rot=0):
    box(w, .9, .45, 'velvet', (x, y, .35), (0, 0, rot)); c, s = math.cos(rot), math.sin(rot)
    box(w, .25, .9, 'velvet', (x - s*.3*-1 - s*0.0, y + .35*c, .75), (0, 0, rot)); box(.25, .9, .7, 'velvet', (x - w/2*c, y - w/2*s, .6), (0, 0, rot)); box(.25, .9, .7, 'velvet', (x + w/2*c, y + w/2*s, .6), (0, 0, rot))
def plant(x, y):
    cyl(.3, .6, 'pot', (x, y, .3), 20)
    for i in range(7):
        a = i/7*math.tau; box(.08, .5, .9, 'leaf', (x + math.cos(a)*.25, y + math.sin(a)*.25, 1.0), (math.radians(20)*math.sin(a), -math.radians(20)*math.cos(a), a))
def bookcase(x, y, w=3, rot=0):
    box(w, .5, 3.4, 'wood', (x, y, 1.7), (0, 0, rot)); c, s = math.cos(rot), math.sin(rot)
    for i in range(5):
        for j in range(int(w*3)):
            h = random.uniform(.35, .5); col = random.choice(['velvet', 'coat2', 'green', 'gold', 'coat'])
            box(.12, .3, h, col, (x - c*(w/2-.2) + c*j*.3*(w/(w)), y - s*(w/2-.2) + s*j*.3 + .0, .45 + i*.62 + h/2 - .2), (0, 0, rot))
def elevator(x=0, y=6.2, scale=1):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.95, minor_radius=.2, major_segments=64, minor_segments=16); a = bpy.context.active_object
    bm = bmesh.new(); bm.from_mesh(a.data); bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.y < -.01], context='VERTS'); bm.to_mesh(a.data); bm.free()
    a.rotation_euler = (math.pi/2, 0, 0); a.location = (x, y, 2.9); a.data.materials.append(M['brass'])
    box(.4, .4, 2.9, 'brass', (x-1.95, y, 1.45)); box(.4, .4, 2.9, 'brass', (x+1.95, y, 1.45)); box(3.5, .1, 2.8, 'cyan', (x, y+.15, 1.4)); sph(1.75, 'cyan', (x, y+.2, 2.9), (1, .05, 1))
    for i in range(-4, 5): box(.05, .06, 3.6, 'gold', (x+i*.4, y-.15, 1.8), (0, math.radians(32 if i % 2 else -32), 0))
    cyl(.4, .1, 'black', (x, y-.2, 5.1), rot=(math.pi/2, 0, 0)); torus(.42, .05, 'brass', (x, y-.23, 5.1), (math.pi/2, 0, 0))
    light('POINT', (x, y-1.2, 2.4), (.4, .92, 1), 260, .3)
def coil(x, y, arc_to=None):
    box(.9, .9, .25, 'brass', (x, y, .13)); cyl(.15, 2.8, 'brass', (x, y, 1.6), 16)
    for i in range(5): torus(.3, .04, 'brass', (x, y, .8 + i*.38))
    torus(.65, .24, 'brass', (x, y, 3.2)); light('POINT', (x, y-.3, 3.5), (.4, .92, 1), 600, .3)
    if arc_to is not None:
        s = 1 if x > 0 else -1; pts = [Vector((x, y, 3.45))]; end = Vector(arc_to)
        for k in range(1, 9): t = k/9; pts.append(pts[0].lerp(end, t) + Vector((random.uniform(-.25, .25), random.uniform(-.1, .1), random.uniform(-.25, .25))))
        pts.append(end); cu = bpy.data.curves.new('arco', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('POLY'); sp.points.add(len(pts)-1)
        for p, v in zip(sp.points, pts): p.co = (*v, 1)
        cu.bevel_depth = .025; co = bpy.data.objects.new('arco', cu); co.data.materials.append(M['cyan']); bpy.context.scene.collection.objects.link(co)
def tapestry(x, y, w=2, h=3):
    box(w, .06, h, 'velvet', (x, y, 3.1)); box(w+.2, .05, .1, 'gold', (x, y-.02, 3.1+h/2)); box(w+.2, .05, .1, 'gold', (x, y-.02, 3.1-h/2))
    box(.1, .05, h, 'gold', (x-w/2, y-.02, 3.1)); box(.1, .05, h, 'gold', (x+w/2, y-.02, 3.1))
def exam_table(x, y):
    cyl(.4, .8, 'wood', (x, y, .4), 24); cyl(2.2, .2, 'wood', (x, y, .9)); torus(2.2, .07, 'brass', (x, y, 1.0)); cyl(1.96, .05, 'felt', (x, y, 1.02))
    for i in range(5):
        r = math.radians(-24 + i*12); box(.36, .52, .012, 'card', (x-.5+i*.25, y-.3, 1.06), (0, 0, r)); box(.14, .2, .014, 'velvet', (x-.5+i*.25, y-.3, 1.066), (0, 0, r))
    box(.4, .26, .06, 'gold', (x+1.1, y+.1, 1.07))
def camera_rig(x, y, table_h=1.02, drop=1.9, power=1400):
    cyl(.05, 6-drop-table_h, 'brass', (x, y, drop + table_h + (6-drop-table_h)/2 - .2), 12); cyl(.42, .3, 'brass', (x, y, table_h+drop)); cyl(.28, .06, 'cyan', (x, y, table_h+drop-.17), 32)
    light('SPOT', (x, y, table_h+drop-.2), (.45, .93, 1), power, .1, spot=70)
def finish(sc, out, samples, cam_loc, look, lens=30, W=1280, H=832, world=.5):
    w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .008, .014, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = world; sc.world = w
    bpy.ops.object.camera_add(location=cam_loc); cam = bpy.context.active_object; sc.camera = cam; cam.data.lens = lens
    cam.rotation_euler = (Vector(look) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples; sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6
    sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.filepath = out; sc.render.image_settings.file_format = 'PNG'
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    bpy.ops.render.render(write_still=True)
