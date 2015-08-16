AlJabr
======

Toolkit for the creation and analysis of small finite groups.

Groups
------

In algebra, groups are sets of elements along with a binary operator that obey
the group axioms.
1. closure: for g and h in group G, g+h is also in G
2. associativity: for g, h, and j in G, (g+h)+j = g+(h+j)
3. identity: for g and e in G with e the identity, g+e = e+g = e
4. inverses: for g in G, there exists g<sup>-1</sup> such that g+g<sup>-1</sup> = g<sup>-1</sup>+g = e

Representation
--------------

Groups are represented by a set of elements and a complete operator table.

Several functions are provided to create standard groups such as cyclic, dihedral, symmetric, and alternating groups as well as the direct product of two groups.

Groups can also be built by filling out an operator table one position at a time.  Portions of the table are automatically generated to guarantee the group axioms hold.