"""Genera niveles.csv (0-100) y comprueba la curva. Uso: python3 niveles_check.py"""
import csv
RANGOS = [  # (desde, hasta, nombre, tramo)
 (0,9,'Curioso','Antesala'),(10,19,'Aprendiz','Antesala'),(20,29,'Manos Ligeras','Antesala'),(30,39,'Aficionado de Salón','Antesala'),
 (40,49,'Mago de Mesa','Bronce'),(50,59,'Artífice','Bronce'),
 (60,66,'Prestidigitador','Plata'),(67,74,'Ilusionista','Plata'),
 (75,82,'Maestro de Mesa','Oro'),(83,89,'Gran Ilusionista','Oro'),
 (90,94,'Archimago','Neón'),(95,99,'Gran Maestro','Neón'),(100,100,'Leyenda de la Planta 13','Neón')]
ROM=['I','II','III','IV','V','VI','VII','VIII','IX','X']
H=lambda n: 0.0025*n**3            # horas acumuladas de práctica para llegar al nivel n
rows=[]
for a,b,nom,tr in RANGOS:
    for n in range(a,b+1):
        sub='' if a==b else ' '+ROM[n-a]
        rows.append(dict(nivel=n,tramo=tr,rango=nom,nombre=nom+sub,horas_acum=round(H(n)),horas_siguiente=round(H(n+1)-H(n),1) if n<100 else 0))
assert [r['nivel'] for r in rows]==list(range(101))
assert all(rows[i]['horas_acum']<=rows[i+1]['horas_acum'] for i in range(100))
assert max(r['horas_siguiente'] for r in rows)<80 and rows[1]['horas_siguiente']<1
with open('niveles.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
for n in (1,10,20,39,40,59,60,74,75,89,90,99,100): print(n,rows[n]['nombre'],rows[n]['horas_acum'],'h acum;',rows[n]['horas_siguiente'],'h al siguiente')
print('OK, 101 niveles')
