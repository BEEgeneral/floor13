"""Estancias del MVP de Floor 13. Uso: python rooms.py <vestibulo|cafe|salon|sala_mesa|planta13> salida.png [muestras]"""
import sys, math, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hotel_lib as H
from hotel_lib import *

def vestibulo(sc):
    shell(20, 13, floor='marble'); [column(x, 5.8) for x in (-9.2, -4.8, 4.8, 9.2)]
    elevator(0, 6.2); coil(-3.4, 5.2, (-.5, 6.0, 5.0)); coil(3.4, 5.2, (.5, 6.0, 5.0))
    plane(2.6, 12.6, 'rug', (0, 0, .01)); box(2.8, .04, .1, 'gold', (0, -5.8, .02)); box(.1, 12.6, .04, 'gold', (-1.35, 0, .02)); box(.1, 12.6, .04, 'gold', (1.35, 0, .02))
    # ventanas con luz de luna
    for x in (-7.2, 7.2): box(1.8, .1, 3.2, 'night', (x, 6.32, 3.1)); box(1.95, .12, .12, 'brass', (x, 6.28, 4.7)); box(.08, .12, 3.2, 'brass', (x, 6.28, 3.1)); box(1.95, .12, .08, 'brass', (x, 6.28, 3.1))
    light('AREA', (-7.2, 4, 3.5), (.4, .55, 1), 220, 2.5, (math.radians(90), 0, math.radians(180))); light('AREA', (7.2, 4, 3.5), (.4, .55, 1), 220, 2.5, (math.radians(90), 0, math.radians(180)))
    # recepción
    box(4.2, 1.1, 1.0, 'wood', (-6, 1.8, .5)); box(4.4, 1.3, .08, 'brass', (-6, 1.8, 1.04)); sph(.14, 'gold', (-7.4, 1.8, 1.2), (1, 1, .6)); box(.5, .3, .05, 'paper', (-5, 1.8, 1.1)); person(-6, 3.0, 'coat2', False)
    # tablón de eventos
    box(3.4, .1, 2.2, 'wood', (7.2, -6.2+12.4-0.0+0, 3.0)); box(3.0, .06, 1.8, 'paper', (7.2, 6.1, 3.0)); tapestry(-7.2, 6.1, 1.6, 2.4) if False else None
    sofa(7, -.5, 3.4); person(7, -.1, 'coat', False, True, .0); plant(-9, -5.5); plant(9, -5.5); plant(-2.2, -5.9); plant(2.2, -5.9)
    for p in ((-9, 5.4), (9, 5.4)): candelabra(*p)
    person(0.4, -2.5, 'coat'); person(-1.0, 1.0, 'coat2')
    pendant(0, -1, 4.6, 700); pendant(0, -4.3, 4.6, 500)
    finish(sc, OUT, SAMPLES, (0, -15.5, 8.4), (0, 1.5, 1.4))

def cafe(sc):
    shell(20, 13, floor='parquet'); [column(x, 5.8) for x in (-9.2, 9.2)]
    # barra y estantería
    box(8, 1.1, 1.1, 'wood', (-4, 4.4, .55)); box(8.3, 1.3, .08, 'brass', (-4, 4.4, 1.12)); box(8, .5, .2, 'brass', (-4, 5.0, 2.6))
    for i in range(4): cyl(.1, .5, ['green', 'velvet', 'gold', 'coat2'][i], (-6.2+i*1.3, 5.7, 2.2), 12); box(7, .3, .06, 'wood', (-4, 5.7, 1.9)); box(7, .3, .06, 'wood', (-4, 5.7, 2.6))
    for x in (-7, -5.5, -4, -2.5, -1): cyl(.28, .08, 'velvet', (x, 3.3, .75), 20); cyl(.04, .72, 'brass', (x, 3.3, .38), 8)
    person(-4, 5.0, 'coat2', False); person(-5.5, 3.3, 'coat', True, True, .0)
    # mesas de charla con 4-6 sillas
    mesas = [(-5, -1.2, 4), (0, -2.0, 6), (5, -.6, 4), (-6.5, -5.0, 4), (1.8, -5.2, 4), (7, -4.8, 4)]
    for i, (x, y, n) in enumerate(mesas):
        round_table(x, y, 1.0 if n == 4 else 1.2, 'wood', 'green' if i % 2 else 'felt')
        for k in range(n):
            a = k/n*math.tau + .3; chair(x + math.cos(a)*1.55, y + math.sin(a)*1.55, a - math.pi/2)
            if k % 2 == 0 or i == 1: person(x + math.cos(a)*1.55, y + math.sin(a)*1.55, ['coat', 'coat2'][(k+i) % 2], k != 1, True)
        pendant(x, y, 4.3, 420)
    # rincón de novatos
    sofa(-8.2, 0.5, 3.0, math.pi/2); box(.1, 1.6, .9, 'paper', (-9.8, -.8, 3.4)); plant(-9, -2.2)
    box(2.0, .6, 1.3, 'black', (8.4, 2.2, .65)); box(2.0, .7, .08, 'ivory', (8.4, 2.15, 1.35))  # piano para jam sessions
    for p in ((-9, -5.6), (9, 5.4)): candelabra(*p)
    finish(sc, OUT, SAMPLES, (0, -15.5, 8.4), (0, 1.0, 1.2))

def salon(sc):
    shell(20, 14, floor='marble'); [column(x, 6.3) for x in (-9.2, -4.8, 4.8, 9.2)]
    # escenario con cortinas y atril
    box(11, 4.2, .7, 'wood', (0, 4.7, .35)); box(11.2, .15, .2, 'brass', (0, 2.6, .75)); box(11, 3.8, .04, 'velvet', (0, 4.7, .72))
    for x in (-5.8, 5.8): box(1.6, .25, 5.4, 'velvet', (x, 6.5, 3.4)); 
    box(14, .3, 1.0, 'velvet', (0, 6.5, 5.4)); box(8, .06, 3.4, 'paper', (0, 6.8, 3.2))
    box(.9, .6, 1.2, 'wood', (-2.0, 3.7, 1.3)); box(1, .7, .05, 'brass', (-2.0, 3.7, 1.95)); person(-1.0, 4.2, 'coat', True, False, .7)
    # patio de butacas
    for r in range(5):
        for c in range(-4, 5):
            if abs(c) < 1 and r < 0: continue
            chair(c*1.15, -.4 - r*1.6, 0)
    for (c, r, j) in ((-2, 1, 'coat'), (0, 2, 'coat2'), (3, 0, 'coat'), (-3, 3, 'coat2'), (1, 4, 'coat'), (2, 2, 'coat2')): person(c*1.15, -.4 - r*1.6, j, r % 2 == 0, True)
    # pasillo y biblioteca de recursos
    plane(2.0, 7, 'rug', (0, -5.0, .01)); bookcase(-9.6, -3.0, 4, math.pi/2) if False else None
    for y in (-5.4, -2.2, 1.0): box(.5, 3.0, 3.4, 'wood', (-9.7, y, 1.7)); 
    for y in (-5.4, -2.2, 1.0):
        for j in range(8):
            for i in range(5): box(.3, .22, random.uniform(.38, .5), random.choice(['velvet', 'coat2', 'green', 'gold', 'coat']), (-9.4, y - 1.2 + j*.32, .5 + i*.62))
    for p in ((-9, 6.4), (9, 6.4), (-9, -6.2), (9, -6.2)): candelabra(*p)
    for y in (-1, -4.4): pendant(0, y, 4.8, 800)
    light('SPOT', (0, 0, 5.6), (1, .75, .5), 3500, .3, spot=60)
    finish(sc, OUT, SAMPLES, (0, -16.5, 8.6), (0, 1.6, 1.3))

def sala_mesa(sc):
    shell(11, 8, floor='parquet'); column(-5.0, 3.6, 4.7); column(5.0, 3.6, 4.7)
    exam_table(0, 0.4); camera_rig(0, 0.4)
    chair(0, -2.9, 0); person(0, -2.9, 'coat2', True, True); chair(0, 3.0, math.pi) ; person(0, 3.0, 'coat', True, True)
    # chimenea, estantería y ventana
    box(2.4, .6, 1.6, 'wood', (-3.2, 3.75, .8)); box(1.4, .4, 1.1, 'black', (-3.2, 3.8, .65)); box(1.0, .2, .6, 'flame', (-3.2, 3.8, .45)); light('POINT', (-3.2, 3.3, .8), (1, .5, .2), 300, .2)
    tapestry(3.2, 3.82, 1.8, 2.6); candelabra(-5, -3.4, 300); candelabra(5, -3.4, 300); plant(5, 2.6)
    box(2.2, .1, .8, 'wood', (-3.2, 3.85, 3.0)); sph(.3, 'gold', (-2.6, 3.7, 3.4))
    pendant(-2.8, -.6, 4.4, 250); pendant(2.8, -.6, 4.4, 250)
    # segunda cámara (móvil en trípode) para la mesa
    cyl(.02, .9, 'black', (1.7, -2.0, .45), 8); box(.12, .01, .2, 'black', (1.7, -2.0, .95), (math.radians(-70), 0, 0)); box(.1, .005, .17, 'cyan', (1.7, -2.01, .96), (math.radians(-70), 0, 0))
    finish(sc, OUT, SAMPLES, (0, -10.5, 6.8), (0, 0.5, 1.2), W=1280, H=832)

def planta13(sc):
    shell(20, 13, floor='marble'); [column(x, 5.8) for x in (-9.2, -4.8, 4.8, 9.2)]
    elevator(0, 6.2); coil(-3.4, 5.2, (-.5, 6.0, 5.0)); coil(3.4, 5.2, (.5, 6.0, 5.0)); tapestry(-7.2, 6.1); tapestry(7.2, 6.1)
    plane(9.6, 6, 'rug', (0, -1.6, .01)); exam_table(0, -1.6); camera_rig(0, -1.6)
    box(3.2, .9, .8, 'wood', (-6.5, 2.4, .4)); box(3.3, 1.0, .08, 'brass', (-6.5, 2.4, .82))
    for i, x in enumerate((-7.4, -6.5, -5.6)): chair(x, 3.5, math.pi); person(x, 3.45, ['coat', 'coat2', 'coat'][i], x != -6.5, True)
    for r in range(3):
        for c in range(4): chair(5.8 + c*1.15, -.6 - r*1.5, math.pi/2)
    person(6.9, -.6, 'coat2', False, True); person(8.05, -2.1, 'coat', True, True); person(0, -.2, 'coat'); person(0.4, -4.6, 'coat2')
    for p in ((-9, 5.4), (9, 5.4), (-9, -5.6), (9, -5.6)): candelabra(*p)
    light('AREA', (0, -5, 5.5), (1, .78, .55), 250, 8, (math.radians(50), 0, 0))
    finish(sc, OUT, SAMPLES, (0, -15.5, 8.4), (0, 1.5, 1.4))

ROOMS = dict(vestibulo=vestibulo, cafe=cafe, salon=salon, sala_mesa=sala_mesa, planta13=planta13)
if __name__ == '__main__':
    name = sys.argv[1]; OUT = sys.argv[2]; SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 32
    sc = H.reset(); H.build_mats(); ROOMS[name](sc); print('OK', name)
